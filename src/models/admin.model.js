import mongoose, { Schema } from "mongoose";


const adminSchema = new Schema({
    username:{
        type: String,
        required: true,
        lowercase: true
    },
    password:{
        type: String,
        required: [true, 'Password is required']
    }
}, {timestamps: true});

export const Admin = mongoose.model("Admin",adminSchema);