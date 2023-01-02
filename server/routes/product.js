import express from 'express';
import formidable from 'express-formidable';

const router = express.Router();

//middlewares
import {requireSignin, isAdmin} from "../middlewares/auth.js";

//controller
import { create, 
            list,
            read,
            photo,
            remove, 
            update, 
            filteredProducts, 
            productsCount, 
            listProducts,
            productsSearch, 
            relatedProducts, 
            getToken, 
            processPayment,
            orderStatus
        } from "../controllers/product.js";

router.post("/product", requireSignin, isAdmin, formidable(), create);  // apply formidable as middleware, then can receive form-data
router.get("/products", list);
router.get("/product/:slug", read);
router.get("/product/photo/:productId", photo);
router.delete("/product/:productId", requireSignin, isAdmin, remove);
router.put("/product/:productId", requireSignin, isAdmin, formidable(), update);
router.post('/filtered-products', filteredProducts); // use post cuz need send id of price/ cat
router.get("/products-count", productsCount);
router.get("/list-products/:page", listProducts);
router.get("/products/search/:keyword", productsSearch);
router.get("/related-products/:productId/:categoryId", relatedProducts);

//payment 
//generate token
router.get('/braintree/token', getToken )
//finalize transaction
router.post('/braintree/payment', requireSignin, processPayment);
router.put('/order-status/:orderId', requireSignin, isAdmin, orderStatus);

export default router;