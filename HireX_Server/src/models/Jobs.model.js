const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
    {
        title:           { type: String, required: true, trim: true },
        company:         { type: String, trim: true }, // Display name, filled from companyId at creation
        companyId:       { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
        location:        { type: String, required: true, trim: true },
        description:     { type: String, required: true },
        salaryRange:     { type: String },
        skillsRequired:  { type: [String], default: [] },
        experienceLevel: { type: String, required: true },
        jobType:         { type: String, required: true, default: "Full-time" },
        status:          { type: String, enum: ["Active", "Closed"], default: "Active" },
        tags:            { type: [String], default: [] },
        employerId:      { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
        companyRating:   { type: Number, default: 0 },
        views:           { type: Number, default: 0 }, // Track profile views for analytics
    },
    { timestamps: true }
);

module.exports = mongoose.model("Jobs", jobSchema);
