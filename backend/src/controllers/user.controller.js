import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { Department } from "../models/department.model.js";

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
    const { username, password, email, fullName, role, departmentId } =
        req.body;

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

    // ---> Fetch departmentId from Department model if the role is "mentor"
    const departmentCheck = await Department.findOne({ _id: departmentId });
    if (!departmentCheck) {
        throw new ApiError(409, "Department does not exist!!");
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
        departmentId: role === "mentor" ? departmentCheck._id : undefined,
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

// Login User
const loginUser = asyncHandler(async (req, res) => {
    // ---> get user details from frontend using req body -> data
    const { username, email, password } = req.body;

    // // Dev Check
    // console.log("Login attempt:", { username, email, password });

    // ---> check by username or email
    if (!username && !email) {
        throw new ApiError(400, "username and email is required");
    }
    /*  Here is an alternative of above code based on logic discuss 
        if (!(username || email)) {
            throw new ApiError(400, "username or email is required");
        }
    */

    // ---> find the user
    const user = await User.findOne({
        $or: [{ username }, { email }],
    });
    if (!user) {
        throw new ApiError(404, "User does not exist!!");
    }
    // console.log(user.role);

    // ---> check password
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials");
    }

    // ---> generate a access and refresh token
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
        user._id
    );

    // ---> send secure cookies
    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );
    const options = {
        httpOnly: true,
        secure: false, // DevOnly
        // secure: true, // Only work with https
    };

    // // Dev Check
    console.log(" ->  Login Successful!!");

    // ---> return response
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken,
                },
                "User logged In Successfully!!"
            )
        );
});

// Logout User
const logoutUser = asyncHandler(async (req, res) => {
    // ---> get user details from findByIdAndUpdate and remove refreshToken from the database
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined,
            },
        },
        {
            new: true,
        }
    );

    // ---> clear cookies and send response
    const options = {
        httpOnly: true,
        secure: true,
    };
    console.log(" ->  Logout Successful!!");
    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged Out Successfully!!"));
});

// Refresh Access Token for re-session
const refreshAccessToken = asyncHandler(async (req, res) => {
    // ---> Extract the incoming refresh token from cookies or request body
    const incomingRefreshToken =
        req.cookies.refreshToken || req.body.refreshToken;
    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized Access");
    }

    try {
        // ---> Decode and verify the incoming refresh token
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        // ---> Retrieve the user associated with the decoded token ID
        const user = await User.findById(decodedToken?._id);
        if (!user) {
            throw new ApiError(401, "Invalid refresh token");
        }

        // ---> Compare the incoming refresh token with the stored refresh token
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used");
        }

        // ---> Generate new Access and Refresh Tokens
        const options = {
            httpOnly: true,
            secure: true,
            // sameSite: 'Strict',  // Recommended for enhanced security
        };
        const { accessToken, newRefreshToken } =
            await generateAccessAndRefreshTokens(user._id);

        // ---> Send the new tokens as cookies and in the JSON response
        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    "Access Token Refreshed"
                )
            );
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Refresh Token");
    }
});

// Change current user password
const changeCurrentPassword = asyncHandler(async (req, res) => {
    // Retriving user information
    const { oldPassword, newPassword } = req.body;

    // Checking if old password is correct or not
    const user = await User.findById(req.user?._id);
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old Password");
    }

    // Change to new password
    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    // return response
    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password changed successfully"));
});

// Get Current User
const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { user: req.user },
                "Current user fetched successfully"
            )
        );
});

// Get All Mentors
const getMentorData = asyncHandler(async (_, res) => {
    try {
        const mentors = await User.find({ role: "mentor" }).select(
            "-password -refreshToken"
        );

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    { user: mentors },
                    "Mentors Fetched Successfully!!"
                )
            );
    } catch (error) {
        throw new ApiError(500, "Failed to Fetch Mentor Data!!");
    }
});

export {
    changeCurrentPassword,
    getCurrentUser,
    getMentorData,
    loginUser,
    logoutUser,
    refreshAccessToken,
    registerUser,
};
