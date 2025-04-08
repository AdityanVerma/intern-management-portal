import { ApiResponse } from "../utils/ApiResponse.js";

export const authorizeRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.user.role)) {
            return res
                .status(403)
                .json(new ApiResponse(403, {}, "Access Denied!!"));
        }
        next();
    };
};
