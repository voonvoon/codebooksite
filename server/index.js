import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import morgan from "morgan";
import authRoutes from "./routes/auth.js";
import categoryRoutes from "./routes/category.js";
import productRoutes from "./routes/product.js";
import cors from "cors";

dotenv.config(); //to execute
//const express = require("express");  this is old way

//console.log("process => ", process); jz to show what process has 
 
const app = express(); //execute express

// db
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("DB Connected"))
    .catch((err) => console.log("DB ERROR =>", err));

// middlewares
app.use(cors());
app.use(morgan("dev"));  // dev mode, give u log 
app.use(express.json()); //express give this to help parse json

// router middleware    
app.use("/api", authRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);

const port = process.env.PORT || 8000

app.listen(port, () => {
    console.log(`Node server is running on port ${port}`);
});