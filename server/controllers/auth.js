import User from "../models/user.js";
import { hashPassword, comparePassword } from "../helpers/auth.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Order from "../models/order.js";  // since we need to retirve the order from db

dotenv.config();

export const register = async (req, res) => {
   try {
      //1.destructure name, email, password from req.body
      const { name, email, password } = req.body;
      //2. all fields require validation
      if(!name.trim()) {
         return res.json({ error: "Name is required!"});
      }
      if (!email) {
         return res.json({ error: "Email is taken" });
      }
      if(!password || password.length < 6) {
         return res.json({ error: "Password must be at least 6 characters long" });
      }
      //3.check if email already taken
      const existingUser = await User.findOne({ email });
      if(existingUser) {
         return res.json({ error: "Email already been taken!" })
      }
      //4.hash pw
      const hashedPassword = await hashPassword(password);

      //5.register user
      const user = await new User({ name, email, password: hashedPassword }).save();

      //6.create signed jwt
      const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET, {expiresIn: "7d",});

      //7.send response
      res.json({
         user: {
            name: user.name,
            email: user.email,
            role: user.role,
            address: user.address,
         },
         token  // no need token: token
      });
   } catch(err) {
      console.log(err);
   }
};

export const login = async (req, res) => {
   try {
      //1.destructure name, email, password from req.body
      const { email, password } = req.body;
      //2. all fields require validation
      if (!email) {
         return res.json({ error: "Email is taken" });
      }
      if(!password || password.length < 6) {
         return res.json({ error: "Password must be at least 6 characters long" });
      }
      //3.check if email already taken
      const user = await User.findOne({ email });
      if(!user) {
         return res.json({ error: "User not found!"});
      }
      //4. compare pw
      const match = await comparePassword(password, user.password);
      if (!match) {
         return res.json({ error: "Wrong password" });
      }


      //5.create signed jwt
      const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET, {expiresIn: "7d",});

      //7.send response
      res.json({
         user: {
            name: user.name,
            email: user.email,
            role: user.role,
            address: user.address,
         },
         token  // no need token: token
      });
   } catch(err) {
      console.log(err);
   }
};

export const secret = async (req, res) => {
   res.json({ currentUser: req.user });  // can access this info cuz hv middleware apply here in route
   
}

export const updateProfile = async (req, res) => {
   try {
      const { name, password, address } = req.body;
      const user = await User.findById(req.user._id);  //cuz we apply requireSigin so we got the user.
      // check password length
      if(password && password.length < 6) {
         return res.json({
            error: "Password is required and should be min 6 characters long!",
         })
      }
      // hash the password
      const hashedPassword = password ? await hashPassword(password) : undefined; // anything undefine not send to DB

      const updated = await User.findByIdAndUpdate(req.user._id, {
         name: name || user.name,   // if new name use new name else use existing user name
         password: hashedPassword || user.password,
         address: address || user.address,
      },
      { new: true }
      );

      updated.password = undefined;
      res.json(updated);
   } catch (err) {
      console.log(err);
   }
};

export const getOrders = async (req, res) => {
   try {
      const orders = await Order.find({ buyer: req.user._id })
      .populate(
         "products",
         "-photo"
      )
      .populate('buyer', 'name');
      res.json(orders);
   } catch (err) {
      console.log(err)
   }
}

export const allOrders = async (req, res) => {
   try {
      const orders = await Order.find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createdAt: "-1" })
      res.json(orders);
   } catch (err) {
      console.log(err)
   }
}