import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Intern } from "../models/intern.model.js";

// Register Intern
const registerIntern = asyncHandler(async (req, res) => {
    // ---> Getting Intern Details
    const {
        fullName,
        age,
        address,
        email,
        phone,
        fathersName,
        identificationMark,
        college,
        course,
        duration,
    } = req.body;

    // ---> Validation
    if (
        [
            fullName,
            age,
            address,
            email,
            phone,
            fathersName,
            identificationMark,
            college,
            course,
            duration,
        ].some((fields) => fields?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required!!");
    }

    // ---> Checking user existance
    const existedIntern = await Intern.findOne({
        email,
    });
    if (existedIntern) {
        throw new ApiError(409, "user with email already exists");
    }

    // ---> create user object - create entry in db
    const intern = await Intern.create({
        fullName,
        age,
        address,
        email,
        phone,
        fathersName,
        identificationMark,
        college,
        course,
        duration,
        internStatus: "new",
    });

    // Find intern by ID (this will also let us able to check if the intern even created or not then we will remove the fields) then
    const createdIntern = await Intern.findById(intern._id);

    // ---> check for intern creation
    if (!createdIntern) {
        throw new ApiError(
            500,
            "Something went wrong while registering the intern!!"
        );
    }

    // ---> return api response
    return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                createdIntern,
                "Intern registered successfully!!"
            )
        );
});

export { registerIntern };
