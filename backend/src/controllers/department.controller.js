import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Department } from "../models/department.model.js";

// Register Department
const registerDepartment = asyncHandler(async (req, res) => {
    // ---> Getting Department Name
    const { departmentName } = req.body;

    // ---> Validation if it is provided or not
    if (!departmentName?.trim()) {
        throw new ApiError(400, "Department name is required!!");
    }

    // ---> Checking if department already exists by either departmentName or _id
    const existedDepartment = await Department.findOne({
        $or: [
            { departmentName: departmentName.toLowerCase() },
            { _id: `DEP${departmentName.trim().toUpperCase()}` },
        ],
    });
    if (existedDepartment) {
        throw new ApiError(409, "Department already exists!!");
    }

    // ---> Creating Department Object - create entry in db
    const newDepartment = await Department.create({
        _id: `DEP${departmentName.trim().toUpperCase()}`,
        departmentName: departmentName.toLowerCase(),
    });

    // ---> check for user creation
    if (!newDepartment) {
        throw new ApiError(500, "Failed to register the department!!");
    }

    // ---> return api response
    return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                newDepartment,
                "Department registered successfully!!"
            )
        );
});

export { registerDepartment };
