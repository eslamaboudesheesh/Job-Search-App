import { Schema, Types, model } from "mongoose";

const jobSchema = new Schema({
    jobTitle: { type: String, required: true },
    jobLocation: { type: String, enum: ['onsite', 'remotely', 'hybrid'], required: true },
    workingTime: { type: String, enum: ['part-time', 'full-time'], required: true },
    seniorityLevel: { type: String, enum: ['Junior', 'Mid-Level', 'Senior', 'Team-Lead', 'CTO'], required: true },
    jobDescription: { type: String, required: true },
    technicalSkills: { type: [String], required: true },
    softSkills: { type: [String], required: true },
    addedBy: { type: Types.ObjectId, ref: 'user', required: true },
    company: { type: Types.ObjectId, ref: 'company', required: true },

},
    { timestamps: true }
);

export const Job = model("job", jobSchema);
