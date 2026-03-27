import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IJob extends Document {
    title: string;
    company: string;
    location: string;
    description: string;
    salaryRange?: string;
    skillsRequired: string[];
    experienceLevel: string;
    jobType: string; // Full-time, Part-time, Contract, Internship
    status: "Active" | "Closed";
    employerId: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const JobSchema = new Schema<IJob>(
    {
        title: { type: String, required: true, trim: true },
        company: { type: String, required: true, trim: true },
        location: { type: String, required: true, trim: true },
        description: { type: String, required: true },
        salaryRange: { type: String },
        skillsRequired: { type: [String], default: [] },
        experienceLevel: { type: String, required: true },
        jobType: { type: String, required: true, default: "Full-time" },
        status: { type: String, enum: ["Active", "Closed"], default: "Active" },
        employerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    },
    { timestamps: true }
);

export const Job: Model<IJob> =
    mongoose.models.Job || mongoose.model<IJob>("Job", JobSchema);
