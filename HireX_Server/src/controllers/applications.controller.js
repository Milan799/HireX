const Application = require("../models/Applications.model");
const Job = require("../models/Jobs.model");
const Notification = require("../models/Notification.model");
const { sendMail } = require("../utils/helperFunctions");
const { getApplicationStatusUpdateEmailTemplate } = require("../utils/emailTemplates");
const { getIo, getOnlineUsers } = require("../socket");

// GET /api/applications
// Fetch candidate's applications, or recruiter's ATS applications per job
const getApplications = async (req, res) => {
    try {
        const { id, role } = req.user;
        const { jobId } = req.query;

        if (role === "recruiter") {
            if (!jobId) return res.status(400).json({ message: "Job ID required" });

            const job = await Job.findById(jobId);
            if (!job || job.employerId.toString() !== id) {
                return res.status(403).json({ message: "Unauthorized access to job" });
            }

            const applications = await Application.find({ jobId })
                .populate("candidateId", "fullName email resumeUrl skills experience education phone location subscription")
                .sort({ createdAt: -1 });
            return res.status(200).json({ applications });
        } else {
            const applications = await Application.find({ candidateId: id })
                .populate({
                    path: "jobId",
                    select: "title location status companyId",
                    populate: {
                        path: "companyId",
                        select: "name logo"
                    }
                })
                .sort({ createdAt: -1 });
            return res.status(200).json({ applications });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// POST /api/applications
// Candidate applies to a job
const applyToJob = async (req, res) => {
    try {
        const { id, role } = req.user;

        if (role !== "candidate") {
            return res.status(403).json({ message: "Only candidates can apply." });
        }

        const { jobId, coverLetter } = req.body;

        const job = await Job.findById(jobId);
        if (!job) return res.status(404).json({ message: "Job not found." });

        const existingApp = await Application.findOne({ candidateId: id, jobId });
        if (existingApp) {
            return res.status(400).json({ message: "Already applied to this job." });
        }

        const User = require("../models/Users.model");
        const candidateUser = await User.findById(id);

        // Enforce application limits for Free Candidates
        const isPro = candidateUser.subscription?.plan === "pro" && candidateUser.subscription?.isActive;
        
        if (!isPro) {
            const currentMonth = new Date().getMonth();
            const currentYear = new Date().getFullYear();
            
            const resetDate = candidateUser.usage?.lastApplicationResetDate ? new Date(candidateUser.usage.lastApplicationResetDate) : new Date(0);
            
            if (currentMonth !== resetDate.getMonth() || currentYear !== resetDate.getFullYear()) {
                candidateUser.usage.monthlyApplications = 0;
                candidateUser.usage.lastApplicationResetDate = Date.now();
            }

            const applicationLimit = candidateUser.subscription?.applyJobLimit || 10;

            if (candidateUser.usage.monthlyApplications >= applicationLimit) {
                await candidateUser.save(); // apply potential resets
                return res.status(403).json({ limitReached: true, message: "Monthly limit reached" });
            }
        }

        // Calculate AI Match Score
        const candidate = await require("../models/Users.model").findById(id);
        let matchScore = 0;

        if (job.skillsRequired && job.skillsRequired.length > 0 && candidate.skills) {
            const candidateSkills = candidate.skills.map(s => s.toLowerCase());
            const matchedSkills = job.skillsRequired.filter(skill => candidateSkills.includes(skill.toLowerCase()));
            matchScore = Math.round((matchedSkills.length / job.skillsRequired.length) * 100);
        }

        const application = await Application.create({
            candidateId: id,
            jobId,
            coverLetter,
            status: "Applied",
            matchScore
        });

        if (!isPro) {
            candidateUser.usage.monthlyApplications += 1;
            await candidateUser.save();
        }

        return res.status(201).json({ message: "Applied successfully", application });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// PUT /api/applications
// Recruiter updates application status in ATS
const updateApplicationStatus = async (req, res) => {
    try {
        const { id, role } = req.user;

        if (role !== "recruiter") {
            return res.status(403).json({ message: "Only recruiters can update status." });
        }

        const { applicationId, status } = req.body;

        const User = require("../models/Users.model");
        const currentUser = await User.findById(id);

        const Company = require("../models/Company.model");
        const company = await Company.findOne({ recruiterId: id });

        // Strict KYC Verification Block
        const restrictedStatuses = ["Shortlisted", "Interview", "Offer", "Hired"];
        if ((!company || company.kycStatus === "pending" || company.kycStatus === "rejected") && restrictedStatuses.includes(status)) {
            return res.status(403).json({ message: "KYC registration strictly required to proceed with hiring or shortlisting candidates." });
        }

        // Daily Interview Limitations (Meter incremented safely via checkInterviewLimit middleware)
        if (status === "Interview" && req.interviewsTodayToIncrement !== undefined) {
            await User.findByIdAndUpdate(id, {
                "usage.interviewsToday": req.interviewsTodayToIncrement,
                "usage.lastResetDate": req.usageDateToSet
            });
        }

        const application = await Application.findById(applicationId).populate("jobId");
        if (!application) return res.status(404).json({ message: "Application not found" });

        if (application.jobId.employerId.toString() !== id) {
            return res.status(403).json({ message: "Unauthorized to update this application" });
        }

        application.status = status;
        await application.save();
        
        await application.populate("candidateId", "fullName email resumeUrl skills experience education phone location subscription");
        await application.populate("jobId"); // Ensure jobId populated for company name

        // 1. Create Notification
        const notificationMessage = `Your application for ${application.jobId.title} has been updated to: ${status}`;
        const newNotification = await Notification.create({
            userId: application.candidateId._id,
            title: "Application Status Updated",
            message: notificationMessage,
            type: "application",
            link: "/mnjuser/applications"
        });

        // Emit socket event if user is online
        try {
            const io = getIo();
            const onlineUsers = getOnlineUsers();
            const socketId = onlineUsers.get(application.candidateId._id.toString());
            if (socketId) {
                io.to(socketId).emit("newNotification", newNotification);
            }
        } catch (socketErr) {
            console.error("Socket emit newNotification failed:", socketErr);
        }

        // 2. Send Email
        const emailHtml = getApplicationStatusUpdateEmailTemplate(
            application.candidateId.fullName || "Candidate",
            application.jobId.title,
            company.name || "the company",
            status,
             "candidate"
        );
        sendMail({
            to: application.candidateId.email,
            subject: `Update on your application for ${application.jobId.title}`,
            html: emailHtml
        }).catch(err => console.error("Status Update Mail Error:", err));

        return res.status(200).json({ message: "Status updated successfully", application });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getApplications,
    applyToJob,
    updateApplicationStatus
};
