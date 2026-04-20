const User = require("../models/Users.model");
const Company = require("../models/Company.model");
const Job = require("../models/Jobs.model");
const Application = require("../models/Applications.model");

// GET /api/admin/stats
// Get holistic platform statistics for the master dashboard
const getPlatformStats = async (req, res) => {
    try {
        const { role } = req.user;
        if (role !== "admin") {
            return res.status(403).json({ error: "Unauthorized. Admin access required." });
        }

        // Count aggregations
        const totalCandidates = await User.countDocuments({ role: "candidate" });
        const totalRecruiters = await User.countDocuments({ role: "recruiter" });
        const totalAdmins = await User.countDocuments({ role: "admin" });

       const totalCompanies = await Company.countDocuments({
    kycStatus: "verified"
});
        
        const totalJobs = await Job.countDocuments();
        const activeJobs = await Job.countDocuments({ status: "Active" });

        const totalApplications = await Application.countDocuments();
        const pendingApplications = await Application.countDocuments({ status: "Pending" });
        const hiredCandidates = await Application.countDocuments({ status: "Hired" });

        return res.status(200).json({
            stats: {
                users: {
                    total: totalCandidates + totalRecruiters + totalAdmins,
                    candidates: totalCandidates,
                    recruiters: totalRecruiters,
                    admins: totalAdmins
                },
                companies: {
                    total: totalCompanies
                },
                jobs: {
                    total: totalJobs,
                    active: activeJobs,
                    closed: totalJobs - activeJobs
                },
                applications: {
                    total: totalApplications,
                    pending: pendingApplications,
                    hired: hiredCandidates
                }
            }
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const ContactMessage = require("../models/ContactMessage.model");

// GET /api/admin/users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ role: "candidate" }).select("-password");
        res.status(200).json({ success: true, count: users.length, data: users });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// DELETE /api/admin/users/:id
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user || user.role !== "candidate") {
            return res.status(404).json({ success: false, error: "Candidate not found" });
        }
        await User.findByIdAndDelete(req.params.id);
        // Also delete their applications if necessary
        await Application.deleteMany({ candidateId: req.params.id });
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// GET /api/admin/employers
const getAllEmployers = async (req, res) => {
    try {
        const employers = await User.find({ role: "recruiter" })
            .select("-password")
            .populate("companyId"); // fetch company data

        res.status(200).json({
            success: true,
            count: employers.length,
            data: employers
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// DELETE /api/admin/employers/:id
const deleteEmployer = async (req, res) => {
    try {
        const employer = await User.findById(req.params.id);
        if (!employer || employer.role !== "recruiter") {
            return res.status(404).json({ success: false, error: "Recruiter not found" });
        }
        await User.findByIdAndDelete(req.params.id);
        // Also delete their jobs and company if necessary
        await Job.deleteMany({ employerId: req.params.id });
        if (employer.companyId) {
            await Company.findByIdAndDelete(employer.companyId);
        }
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// GET /api/admin/jobs
const getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find().populate("companyId").populate("employerId", "fullName email");
        res.status(200).json({ success: true, count: jobs.length, data: jobs });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// DELETE /api/admin/jobs/:id
const deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ success: false, error: "Job not found" });
        }
        await Job.findByIdAndDelete(req.params.id);
        await Application.deleteMany({ jobId: req.params.id });
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// GET /api/admin/messages
const getAllMessages = async (req, res) => {
    try {
        const messages = await ContactMessage.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: messages.length, data: messages });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// DELETE /api/admin/messages/:id
const deleteMessage = async (req, res) => {
    try {
        const message = await ContactMessage.findById(req.params.id);
        if (!message) {
            return res.status(404).json({ success: false, error: "Message not found" });
        }
        await ContactMessage.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    getPlatformStats,
    getAllUsers,
    deleteUser,
    getAllEmployers,
    deleteEmployer,
    getAllJobs,
    deleteJob,
    getAllMessages,
    deleteMessage
};
