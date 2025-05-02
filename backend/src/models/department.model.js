import mongoose, { Schema } from "mongoose";

const departmentSchema = new Schema({
    _id: {
        type: String, // Custom ID will be String like "DEPCSE"
    },
    departmentName: {
        type: String,
        required: true,
        trim: true,
    },
});

export const Department = mongoose.model("Department", departmentSchema);
