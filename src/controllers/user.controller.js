import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";



const userInput = asyncHandler( async(req, res) => {
    const {name, socialHandle} = req.body;

    //validation - not empty field
    if ([name, socialHandle].some((field)=> field?.trim() === "")){
        throw new ApiError(400, "All fields are required");
    } 

    //Validate uploaded files
    if (!req.files || req.files.length === 0){
        throw new ApiError(400, "Image file are required");
    }
    //getting file paths
    const allImagePaths = req.files.map(file => file.path);


    //images upload on cloudinary
    const images = [];
    for (const path of allImagePaths) {
        try {
            const uploaded = await uploadOnCloudinary(path);
            images.push(uploaded.url);
        } catch (error) {
            throw new ApiError(500, `Error uploading image: ${error.message}`);
        }
    }

    //save user to database
    const user = await User.create({
        name,
        socialHandle,
        images
    })
    

    if(!user){
        throw new ApiError(400, "required field")
    }

    //send response
    return res.status(201)
    .json(new ApiResponse(200, user, "User registered successfully"))
})

const userData = asyncHandler( async(req, res) => {
    try {
        // Fetch user data from the database
        const users = await User.find();

        // If no users found, you could optionally return a message for that
        if (!users || users.length === 0) {
            return res.status(404).json(new ApiResponse(404, [], "No users found"));
        }

        // Send success response with the users data
        return res.status(200).json(new ApiResponse(200, users, "Users fetched successfully"));
    } catch (error) {
        // Handle and send a detailed error response
        throw new ApiError(500, `Error fetching users: ${error.message}`);
    }
});

const adminLogin = asyncHandler(async (req, res) => {

    const { username, password } = req.body;

    // Validation - Check if username and password are provided
    if (!username || !password) {
        throw new ApiError(400, "Username and password are required");
    }

    // Check if the provided credentials match the env file admin credentials
    if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
        // Set session for the admin
        req.session.isAdmin = true;  


        return res.status(200).json(new ApiResponse(200, "Admin logged in successfully"));
    } else {
        throw new ApiError(401, "Invalid username or password");
    }
});

const adminLogout = asyncHandler(async (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json(new ApiResponse(500, null, "Error logging out"));
        }
        res.status(200).json(new ApiResponse(200, null, "Admin logged out successfully"));
    });
});

export {
    userInput,
    userData,
    adminLogin,
    adminLogout
}