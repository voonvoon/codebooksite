import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 160,
    },
    slug: {
        type: String,
        lowercase: true,
    },
    description: {
        type: {},   // any type of content will be able to save
        required: true,
        maxlength: 2000,
    },

    price: {
        type: Number,
        trim: true,
        required: true,
    },
    category: {                  // each product must hv a cat, use ObjectId to populate it when need.
        type: ObjectId,
        ref: "Category",
        required: true,
    },
    quantity: {
        type: Number,
    },
    sold: {
        type: Number,
        default: 0
    },
    photo: {             // we use mongo to save up photo
        data: Buffer,
        contentType: String
    },
    shipping: {
        required: false,
        type: Boolean,
    },

}, {timestamps: true }
);

export default mongoose.model("Product", productSchema);