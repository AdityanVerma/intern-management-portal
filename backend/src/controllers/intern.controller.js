import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import xlsx from "xlsx";
import fs from "fs";
import path from "path";
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
    if (isNaN(Number(age)) || Number(age) <= 0) {
        throw new ApiError(400, "Age must be a valid positive number");
    }
    if (isNaN(Number(duration)) || Number(duration) <= 0) {
        throw new ApiError(400, "Duration must be a valid positive number");
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

// Import Intern
const importInterns = asyncHandler(async (req, res, next) => {
    try {
        // ---> Getting file from the request (sent via multer middleware)
        const file = req.files?.filename ? req.files.filename[0] : null;

        // ---> File validation: Check if file exists (was uploaded)
        if (!file) {
            throw new ApiError(
                400,
                "The file appears to be missing or corrupted. Kindly re-upload the file to proceed."
            );
        }

        const filePath = path.resolve(file.path); // Get absolute path to the uploaded file on disk
        const ext = path.extname(file.originalname); // Extract the file extension (e.g. .csv, .xlsx, .xls)

        // ---> Validate file type: Allow only Excel (.xlsx, .xls) or CSV (.csv) files
        if (![".xlsx", ".xls", ".csv"].includes(ext)) {
            fs.unlinkSync(filePath);
            throw new ApiError(400, "Only Excel or CSV files are allowed");
        }

        const workbook = xlsx.readFile(filePath); // Read the uploaded Excel/CSV file
        const sheetName = workbook.SheetNames[0]; // Get the name of the first sheet in the file
        const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]); // Convert the sheet data to a JSON array of rows

        // ---> Arrays to store new interns and skipped row information
        const internsToInsert = [];
        const skippedRows = [];
        let rowIndex = 2; // Start at 2 to match Excel row numbers (assuming row 1 = headers)

        // ---> Loop through each row in the file
        for (const row of sheetData) {
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
            } = row;

            // ---> Track missing required fields
            const missingFields = [];

            if (!fullName) missingFields.push("fullName");
            if (!age) missingFields.push("age");
            if (!address) missingFields.push("address");
            if (!email) missingFields.push("email");
            if (!phone) missingFields.push("phone");
            if (!fathersName) missingFields.push("fathersName");
            if (!identificationMark) missingFields.push("identificationMark");
            if (!college) missingFields.push("college");
            if (!course) missingFields.push("course");
            if (!duration) missingFields.push("duration");

            // ---> If any required field is missing, skip the row and log it
            if (missingFields.length > 0) {
                skippedRows.push({
                    row: rowIndex,
                    missing: missingFields,
                });
                rowIndex++;
                continue;
            }

            // ---> Check for duplicate intern (based on email)
            const exists = await Intern.findOne({ email });
            if (exists) {
                rowIndex++;
                continue;
            }

            // ---> If all validations pass, add intern to array
            internsToInsert.push({
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

            rowIndex++;
        }

        // ---> Delete uploaded file after processing
        fs.unlinkSync(filePath);

        // ---> If no valid rows found, return error
        if (internsToInsert.length === 0) {
            throw new ApiError(400, "No valid new interns found to import");
        }

        // ---> Insert all valid interns into the database
        await Intern.insertMany(internsToInsert);

        // ---> Send API response with success message and result summary
        return res
            .status(201)
            .json(
                new ApiResponse(
                    201,
                    {
                        inserted: internsToInsert.length,
                        skipped: skippedRows.length,
                    },
                    "Interns imported successfully"
                )
            );
    } catch (error) {
        next(error);
    }
});

// Get Interns
const getInternData = asyncHandler(async (req, res) => {
    const interns = await Intern.find();

    return res
        .status(200)
        .json(new ApiResponse(200, { intern: interns }, "Intern"));
});

export { getInternData, importInterns, registerIntern };
