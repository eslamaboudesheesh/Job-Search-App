import { Schema, Types, model } from "mongoose";

const companySchema = new Schema(
    {
        companyName: {
            type: String,
            required: true,
            unique: true
        },
        description: {
            type: String,
            required: true
        },
        industry: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        numberOfEmployees: {
            type: String,
            required: true
        },
        companyEmail: {
            type: String,
            required: true,
            unique: true
        },
        companyHR: {
            type: Types.ObjectId,
            ref: 'user',
            required: true
        }
    },
    { timestamps: true }
);

export const Company = model("company", companySchema);
