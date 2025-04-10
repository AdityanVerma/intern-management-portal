import mongoose, { Schema } from "mongoose";

const certificateSchema = new Schema(
    {
        internshipId: {
            type: Schema.Types.ObjectId,
            ref: "Internship",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export const Certificate = mongoose.model("Certificate", certificateSchema);
