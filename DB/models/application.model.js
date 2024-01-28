import { Schema, Types, model } from "mongoose";

const applicationSchema = new Schema(
    {
        jobId: { type: Types.ObjectId, ref: 'job', required: true },
        userId: { type: Types.ObjectId, ref: 'user', required: true },
        userTechSkills: { type: [String] },
        userSoftSkills: { type: [String] },
        userResume: Object, // Store the URL or file path to the uploaded resume
    },
    { timestamps: true }
);

export const Application = model("application", applicationSchema);
