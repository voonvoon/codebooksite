import Product from "../models/product.js";
import fs from "fs";  // comes with nodejs
import slugify from "slugify";
import braintree from "braintree";
import dotenv from 'dotenv';
import Order from "../models/order.js";
import sgMail from "@sendgrid/mail";

dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_KEY);

const gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY
    
});

export const create = async (req, res) => {
    try {
        // when haddle file e.g: photo, can't use json, use form data in postman
        //console.log(req.fields); // after use formidable can get field & files
        //console.log(req.files);
        const { name, description, price, category, quantity, shipping } = req.fields;  //destruc from postmam form-data item
        const { photo } = req.files;

        //validation 
        switch(true) {
            case !name.trim():                   
               return res.json({ error: "Name is required" });                 // use return keyword ensure will end here doesn't go down there
            case !description.trim():
                return res.json({ error: "Description is required" });
            case !price.trim():
                return res.json({ error: "Price is required" });
            case !category.trim():
                return res.json({ error: "Category is required" });
            case !quantity.trim():
                return res.json({ error: "Quantity is required" });
            case !shipping.trim():
                return res.json({ error: "Shipping is required" });
            case photo && photo.size > 1000000:                           // photo is not mandatory but make it limit to its size(1mb)
                return res.json({ error: "Image should be less than 1mb in size" }); 
    }

    // create product
    const product = new Product({...req.fields, slug: slugify(name) });

    if(photo) {
        product.photo.data = fs.readFileSync(photo.path);       // need read this file, use sf module
        product.photo.contentType = photo.type;
    }

    await product.save();
    res.json(product);

    } catch (err) {
        console.log(err);
        return res.status(400).json(err.message);
    }
};

export const list = async (req, res) => {
    try {
        const products = await Product.find({})
        .populate("category")
        .select("-photo")  // create seperate endpoint to req photo to mk it faster, here we deselect it!
        .limit(12)
        .sort({ createdAt: -1 });  // so the one created later list on top

        res.json(products);
    } catch (err) {
        console.log(err);
    }
}

export const read = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug })
    .select("-photo")
    .populate("category");

    res.json(product);
  } catch (err) {
    console.log(err);
  }
};

export const photo = async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId).select("photo");  //jz select photo, don't need anything else.
        if (product.photo.data) {
            res.set("content-Type", product.photo.contentType);
            return res.send(product.photo.data);
        }
    } catch (err) {
        console.log(err);
    }
}


export const remove = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.productId).select("-photo");
        res.json(product);
    } catch (err) {
        console.log(err);
    }   
}

export const update = async (req, res) => {
    try {
        // when haddle file e.g: photo, can't use json, use form data in postman
        //console.log(req.fields); // after use formidable can get field & files
        //console.log(req.files);
        const { name, description, price, category, quantity, shipping } = req.fields;  //destruc from postmam form-data item
        const { photo } = req.files;

        //validation 
        switch(true) {
            case !name.trim():
                res.json({ error: "Name is required" });
            case !description.trim():
                res.json({ error: "Description is required" });
            case !price.trim():
                res.json({ error: "Price is required" });
            case !category.trim():
                res.json({ error: "Category is required" });
            case !quantity.trim():
                res.json({ error: "Quantity is required" });
            case !shipping.trim():
                res.json({ error: "Shipping is required" });
            case photo && photo.size > 1000000:                           // photo is not mandatory but make it limit to its size(1mb)
                res.json({ error: "Image should be less than 1mb in size" });
    }

    // update product
    const product = await Product.findByIdAndUpdate(req.params.productId, {
        ...req.fields,    // 2nd argue is what is it u want update
        slug: slugify(name),
    },
    { new: true } 
    );

    if(photo) {
        product.photo.data = fs.readFileSync(photo.path);       // need read this file, use sf module
        product.photo.contentType = photo.type;
    }

    await product.save();
    res.json(product);

    } catch (err) {
        console.log(err);
        return res.status(400).json(err.message);
    }
};

export const filteredProducts = async (req, res) => {
    try {
        const { checked, radio } = req.body;  // expect to get checked, radio state from req.body

        let args = {};  // create a new obj to hold checked , radio value
        if (checked.length > 0) args.category = checked;  
        if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] }; // mongo way of query [v1,v2] = [0],[1]

        console.log("args =>", args);

        const products = await Product.find(args);
        console.log("filtered products query =>", products.length);
        res.json(products);

    } catch (err) {
        console.log(err)
    }
}

export const productsCount = async (req, res) => {
    try {
        const total = await Product.find({}).estimatedDocumentCount();
        res.json(total);
    } catch (err) {
        console.log(err);
    }
};

export const listProducts = async (req, res) => {
    try {
      const perPage = 6;  // 6 products per page
      const page = req.params.page ? req.params.page : 1;   // if can't find param then use default 1
                                            //skip the product already shown e.g pg 1 (1-1) * 6 =0 , so pg 1 no skip
      const products = await Product.find({}).select("-photo").skip((page - 1) * perPage).limit(perPage).sort({ createdAt: -1 });

      res.json(products);
    } catch (err) {
        console.log(err);
    }
};

export const productsSearch = async (req, res) => {
    try {
        const { keyword } = req.params;
        const results = await Product.find({
           //$or This operator is used to perform logical OR operation on the array of two or more expressions and select or retrieve only those documents that match at least one of the given expression in the array.
          $or: [
            { name: { $regex: keyword, $options: "i" } },
            { description: { $regex: keyword, $options: "i" }},
          ]
        }).select("-photo");

        res.json(results);
    } catch (err) {
        console.log(err)
    }
}

export const relatedProducts = async (req, res) => {
    try {
        const { productId, categoryId } = req.params;
        const related = await Product.find({     // will give us related products not inc itself.
            category: categoryId,
            _id: {$ne: productId},  // $ne=not inc this product id  
        }).select("-photo").populate("category").limit(3);

        res.json(related);
    } catch (err) {
        console.log(err)
    }
};

export const getToken = async (req, res) => {
    try {
        gateway.clientToken.generate({}, function (err, response) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.send(response); // this res is d actual token
            }
        });
    } catch (err) {
        console.log(err)
    }
};

export const processPayment = async (req, res) => {
    try {
        //console.log(req.body);
        //let nonce = req.body.nonce;
        const {nonce, cart} = req.body;

        let total = 0;
        cart.map((i) => {
            total += i.price;
        });
        //console.log('total =>', total)
        //charge cust
        let newTransaction = gateway.transaction.sale(
             //1st argu:
            {
            amount: total,
            paymentMethodNonce: nonce,
            options: {
                submitForSettlement: true,
              },
            }, // 2nd argu is cb func
        function (error, result) {
            if (result) {
                //res.send(result);
                //create order
                const order = new Order({
                    products: cart,
                    payment: result,
                    buyer: req.user._id,  // currently login user
                }).save();
                // decrement quantity
                decrementQuantity(cart);
                res.json({ ok: true });
            } else {
                res.status(500).send(error);
            }
        });  
    } catch (err) {
        console.log(err)
    }
};

const decrementQuantity = async (cart) => {
    try {
        // build mongodb query
        const bulkOps = cart.map((item) => {
            return {
                updateOne: {
                    filter: {_id: item._id},
                    update: { $inc: {quantity: -1, sold: +1} },  
                },
            };
        });

        const updated = await Product.bulkWrite(bulkOps, {});
        console.log("blk updated", updated);
    } catch (err) {
        console.log(err)
    }
}

export const orderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(orderId, { status }, { new:true }).populate(
            "buyer",
            "email name"    // no comma!
        );// so when update status also can access buyer email

        //prepare email
        const emailData = {
            from: process.env.EMAIL_FROM,
            to: order.buyer.email,
            //to:"hvlifeasy@gmail.com",
            subject: "Order Status",
            html: `
                <h1> Hi ${order.buyer.name}, your order's status is: <span style="color:red;">${order.status}</span> </h1>
                <p>Visit <a href="${process.env.CLIENT_URL}/dashboard/user/orders">Your dashboard</a>for more details</p>
            `,
        };
        // send email
        try {
            await sgMail.send(emailData);
        } catch (err) {
            console.log(err);
        }

        res.json(order);
    } catch(err) {
        console.log(err);
    }
}