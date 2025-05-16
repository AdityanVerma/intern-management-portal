import mongoose, { Schema } from "mongoose";

const internshipSchema = new Schema(
    {
        internId: {
            type: Schema.Types.ObjectId,
            ref: "Intern",
            required: true,
        },
        mentorId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        departmentId: {
            type: String,
            ref: "Department",
            required: true,
        },
        remarks: {
            type: String,
        },
        attendance: {
            type: String,
        },
        projectSubmission: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

export const Internship = mongoose.model("Internship", internshipSchema);
