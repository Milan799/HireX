const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    website: {
      type: String,
      trim: true,
    },
    logo: {
      type: String, // Cloudinary URL
    },
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    location: {
      type: String,
    },
    industry: {
      type: String,
    },
    phone: {
      type: String,
      trim: true,
    },
    // KYC Verification Fields
    kycDocumentType: {
      type: String,
    },
    kycFileUrl: {
      type: String,
    },
    kycStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },
    kycRejectionReason: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Company", companySchema);
