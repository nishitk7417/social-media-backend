import mongoose, {Schema} from "mongoose";



const userSchema = new Schema({
    name:{
        type: String,
        required: true,
        index: true,
        trim: true
    },
    socialHandle:{
        type: String,
        required: true
    },
    images:[{
        type: String,  //cloudinary
        required: true
    }]
},{timestamps: true});

export const User = mongoose.model("User", userSchema);