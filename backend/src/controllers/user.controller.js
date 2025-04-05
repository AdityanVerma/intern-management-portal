import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(
            500,
            "Something went wrong while generating access and refresh token"
        );
    }
};

// Register User
const registerUser = asyncHandler(async (req, res) => {
    // ---> Getting user details
    const { username, password, email, fullName, role, department } = req.body;

    // ---> Validation
    if (
        [username, password, email, fullName, role].some(
            (field) => field?.trim() === ""
        )
    ) {
        throw new ApiError(400, "All fields are required!!");
    }

    // ---> Checking user existance
    const existedUser = await User.findOne({
        $or: [{ username }, { email }],
    });
    if (existedUser) {
        throw new ApiError(409, "user with email or username already exists");
    }

    // ---> check for avatar
    let avatarLocalPath;
    if (
        req.files &&
        Array.isArray(req.files.avatar) &&
        req.files.avatar.length > 0
    ) {
        avatarLocalPath = req.files.avatar[0].path;
    }

    // ---> upload avatar to cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);

    // ---> create user object - create entry in db
    const user = await User.create({
        username: username.toLowerCase(),
        password,
        email,
        fullName,
        avatar: avatar?.url || "",
        role,
        department: department || "",
    });

    // Find user by ID (this will also let us able to check if the user even created or not then we will remove the fields) then
    // ---> remove password and refresh token filed from response
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    // ---> check for user creation
    if (!createdUser) {
        throw new ApiError(
            500,
            "Something went wrong while registering the user!!"
        );
    }

    // ---> return api response
    return res
        .status(201)
        .json(
            new ApiResponse(200, createdUser, "User registered successfully!!")
        );
});

export { registerUser };
