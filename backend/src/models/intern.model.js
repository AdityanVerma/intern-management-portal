import mongoose, { Schema } from "mongoose";

var STATUS = ['new', 'undergoing', 'completed'];

const internSchema = new Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true,
        },
        age: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            index: true,
        },
        phone: {
            type: String,
            required: true,
        },
        fathersName: {
            type: String,
            required: true,
            trim: true,
        },
        identificationMark: {
            type: String,
            required: true,
        },
        collage: {
            type: String,
            required: true,
        },
        course: {
            type: String,
            required: true,
        },
        duration: {
            type: String,
            required: true,
        },
        mentorId: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        internStatus: {
            type: String,
            enum: STATUS,
        }
    },
    {
        timestamps: true,
    }
);

export const Intern = mongoose.model("Intern", internSchema);
