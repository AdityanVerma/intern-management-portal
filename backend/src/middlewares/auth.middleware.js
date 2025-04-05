import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        // Token Retrieval
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        console.log(token);
        // Token Validation
        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }

        // Token Decoding and Verification
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // User Verification
        const user = await User.findById(decodedToken?._id).select(
            "-password -refreshToken"
        );

        // Handling Non-existent User
        if (!user) {
            throw new ApiError(401, "Invalid Access Token");
        }

        // Attaching User Object to Request
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token");
    }
});
