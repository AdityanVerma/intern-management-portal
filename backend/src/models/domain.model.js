import mongoose, { Schema } from "mongoose";

const domainSchema = new Schema(
    {
        name: {
            type: String,
            require: true,
        },
        departmentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Department",
            require: true,
        },
    },
    {
        timestamp: true,
    }
);

export const Domain = mongoose.model("Domain", domainSchema);
