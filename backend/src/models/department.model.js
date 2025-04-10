import mongoose, { Schema } from "mongoose";

const departmentSchema = new Schema(
    {
        name: {
            type: String,
        },
    },
    {
        timestamp: true
    }
);

export const Department = mongoose.model("Department", departmentSchema);
