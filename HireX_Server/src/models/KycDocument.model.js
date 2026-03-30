const mongoose = require("mongoose");

const kycDocumentSchema = new mongoose.Schema(
    {
        recruiterId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
            required: true,
        },
        companyName: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true },
        websiteUrl: { type: String },

        documentType: { type: String, required: true }, // GST, PAN, Company Registration
        fileUrl: { type: String, required: true },

        status: {
            type: String,
            enum: ["pending", "verified", "rejected"],
            default: "pending",
        },
        rejectionReason: { type: String },
    },
    { timestamps: true }
);

module.exports = mongoose.model("KycDocument", kycDocumentSchema);
