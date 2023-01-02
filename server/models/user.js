import mongoose from "mongoose";

const { Schema } = mongoose; // destructure method = mongoose.Schema , so jz use Schema shorter

const userSchema = new Schema({
    name: {
       type: String,
       trim: true,
       required: true,
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
     },
     password : {
        type: String,
        required: true,
        min: 6,
        max: 64,
     }, 
     address: {
        type: String,
        trim: true,
     },
     role: {
        type: Number,
        default: 0,
     },           
},
    {timestamps:true}   // so it will create a time whenever we update
);

export default mongoose.model("User", userSchema); //create mongoose modal with name 'User' and will base on schema 'userSchema'