const mongoose = require("mongoose");
const Users = require("../models/Users.model");
const Company = require("../models/Company.model");
const Notification = require("../models/Notification.model");
const { sendMail } = require("../utils/helperFunctions");
const { getAdminKycUpdateEmailTemplate } = require("../utils/emailTemplates");
const { getIo, getOnlineUsers } = require("../socket");

// 1. Recruiter Submits KYC Document
exports.submitKyc = async (req, res) => {
    try {
        const { companyName, fullName, phone, city, country, website, documentType, bio, industry } = req.body;
        const userId = req.user.id;

        if (!req.file) {
            return res.status(400).json({ success: false, message: "KYC document file is required" });
        }

        // Fallback to local disk file served statically
        const fileUrl = `http://localhost:5000/uploads/${req.file.filename}`;

        // Seed data to ATS Company Model
        let company = await Company.findOne({ recruiterId: userId });
        if (company) {
            company.name = companyName;
            company.phone = phone;
            company.website = website;
            company.description = bio || "A verified company hiring on HireX.";
            company.location = city && country ? `${city}, ${country}` : city || country || "";
            company.industry = industry || "";

            company.kycDocumentType = documentType;
            company.kycFileUrl = fileUrl;
            company.kycStatus = "pending";
            company.kycRejectionReason = "";
            await company.save();
        } else {
            company = await Company.create({
                recruiterId: userId,
                name: companyName,
                phone: phone,
                website: website,
                location: city && country ? `${city}, ${country}` : city || country || "",
                description: bio || "A verified company hiring on HireX.",
                industry: industry || "",

                kycDocumentType: documentType,
                kycFileUrl: fileUrl,
                kycStatus: "pending"
            });
        }

        // Update Recruiter User Profile
        await Users.findByIdAndUpdate(userId, {
            fullName: fullName || companyName, // Map explicitly or fallback
            "location.city": city,
            "location.country": country,
            companyId: company._id
        });

        res.status(200).json({ success: true, message: "KYC Submitted Successfully", data: company });
    } catch (error) {
        console.error("KYC Submit Error:", error);
        res.status(500).json({ success: false, message: error.message || "Internal server error during KYC submission.", stack: error.stack });
    }
};

// 2. Fetch User's Own KYC Status
exports.getKycStatus = async (req, res) => {
    try {
        const company = await Company.findOne({ recruiterId: req.user.id });
        if (!company) {
            return res.status(404).json({ success: false, message: "No KYC data found" });
        }
        res.status(200).json({ success: true, data: company });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching KYC status" });
    }
};

// 3. Admin: Get all Pending KYC
exports.getPendingKycList = async (req, res) => {
    try {
        const pendingDocuments = await Company.find({ kycStatus: "pending" }).populate("recruiterId", "fullName email phone");
        res.status(200).json({ success: true, data: pendingDocuments });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error fetching pending KYCs" });
    }
};

// 4. Admin: Evaluate (Approve/Reject) KYC
exports.evaluateKyc = async (req, res) => {
    try {
        const { docId } = req.params;
        const { status, rejectionReason } = req.body;

        if (!["verified", "rejected"].includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid evaluation status." });
        }

        const company = await Company.findById(docId);
        if (!company) {
            return res.status(404).json({ success: false, message: "Company not found." });
        }

        company.kycStatus = status;
        if (status === "rejected") {
            company.kycRejectionReason = rejectionReason || "Your documents did not meet our verification criteria.";
        } else {
            company.kycRejectionReason = "";
        }
        await company.save();


        res.status(200).json({ success: true, message: `KYC automatically marked as ${status}`, data: company });

        // Retrieve recruiter user to send email and notification
        try {
            const recruiter = await Users.findById(company.recruiterId);
            if (recruiter) {
                // 1. Create Notification
                const newNotification = await Notification.create({
                    userId: recruiter._id,
                    title: "KYC Verification Update",
                    message: status === "verified" ? "Your KYC verification has been approved." : "Your KYC verification was rejected.",
                    type: "kyc",
                    link: status === "verified" ? "/employer/dashboard" : "/employer/kyc"
                });

                // Emit socket event if user is online
                try {
                    const io = getIo();
                    const onlineUsers = getOnlineUsers();
                    const socketId = onlineUsers.get(recruiter._id.toString());
                    if (socketId) {
                        io.to(socketId).emit("newNotification", newNotification);
                    }
                } catch (socketErr) {
                    console.error("Socket emit newNotification failed (kyc):", socketErr);
                }

                // 2. Send Email
                const emailHtml = getAdminKycUpdateEmailTemplate(
                    recruiter.fullName || "Recruiter",
                    status,
                    company.kycRejectionReason,
                    "recruiter"
                );
                sendMail({
                    to: recruiter.email,
                    subject: status === "verified" ? "KYC Verification Approved" : "Action Required: KYC Verification Rejected",
                    html: emailHtml
                }).catch(err => console.error("KYC Evaluation Mail Error:", err));
            }
        } catch (postUpdateErr) {
            console.error("Error creating KYC notification/email:", postUpdateErr);
        }

    } catch (error) {
        res.status(500).json({ success: false, message: "Error handling KYC evaluation" });
    }
};
