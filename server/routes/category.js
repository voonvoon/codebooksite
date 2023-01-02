import express from 'express';

const router = express.Router();

//middlewares
import {requireSignin, isAdmin} from "../middlewares/auth.js";

//controller
import { create, update, remove, list, read, productsByCategory } from "../controllers/category.js";

router.post("/category", requireSignin, isAdmin, create);
router.put("/category/:categoryId", requireSignin, isAdmin, update);  // can hv same name as above , cuz is put method now , need id to update
router.delete("/category/:categoryId", requireSignin, isAdmin, remove); // need id for delete, use remove as delete reserved key word
router.get("/categories", list);
router.get("/category/:slug", read);
router.get("/products-by-category/:slug", productsByCategory);


export default router;


