import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IApplication extends Document {
    candidateId: mongoose.Types.ObjectId;
    jobId: mongoose.Types.ObjectId;
    resumeUrl?: string;
    status: "Pending" | "Reviewed" | "Shortlisted" | "Interview" | "Rejected" | "Hired";
    coverLetter?: string;
    matchScore?: "High Match" | "Medium Match" | "Low Match"; // AI/Resdex sorting
    createdAt: Date;
    updatedAt: Date;
}

const ApplicationSchema = new Schema<IApplication>(
    {
        candidateId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true },
        resumeUrl: { type: String },
        status: {
            type: String,
            enum: ["Pending", "Reviewed", "Shortlisted", "Interview", "Rejected", "Hired"],
            default: "Pending",
        },
        coverLetter: { type: String },
        matchScore: {
            type: String,
            enum: ["High Match", "Medium Match", "Low Match"],
        },
    },
    { timestamps: true }
);

export const Application: Model<IApplication> =
    mongoose.models.Application || mongoose.model<IApplication>("Application", ApplicationSchema);
