const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
    {
        candidateId: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
        jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Jobs", required: true },
        resumeUrl: { type: String },
        status: {
            type: String,
            enum: ["Applied", "Shortlisted", "Interview", "Offer", "Rejected", "Hired"],
            default: "Applied",
        },
        coverLetter: { type: String },
        matchScore: {
            type: Number,
            min: 0,
            max: 100,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Applications", applicationSchema);
