const Job = require("../models/Jobs.model");
const User = require("../models/Users.model");

// GET /api/jobs
// Fetch all active jobs or jobs for a specific employer
const getJobs = async (req, res) => {
    try {
        const { keyword = "", location = "", limit = 10, skip = 0, employerId } = req.query;

        const query = {};
        
        if (!employerId) {
            query.status = "Active";
        } else {
            query.employerId = employerId;
        }

        if (keyword) {
            query.$or = [
                { title: { $regex: keyword, $options: "i" } },
                { company: { $regex: keyword, $options: "i" } },
                { skillsRequired: { $regex: keyword, $options: "i" } },
            ];
        }
        if (location) {
            query.location = { $regex: location, $options: "i" };
        }

        const jobs = await Job.find(query)
            .sort({ createdAt: -1 })
            .skip(Number(skip))
            .limit(Number(limit))
            .populate("employerId", "email fullName")
            .populate("companyId");

        const total = await Job.countDocuments(query);

        return res.status(200).json({ jobs, total, skip, limit });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// POST /api/jobs
// Create a new job (Recruiters only)
const createJob = async (req, res) => {
    try {
        const { id, role } = req.user;
        
        if (role !== "recruiter") {
            return res.status(403).json({ message: "Recruiter access required." });
        }

        const user = await User.findById(id);
        if (!user.companyId) {
            return res.status(400).json({ message: "Please complete your company profile before posting a job." });
        }

        const Company = require("../models/Company.model");
        const company = await Company.findById(user.companyId);

        const newJob = await Job.create({
            ...req.body,
            employerId: id,
            companyId: user.companyId,
            company: req.body.company || company?.name || "",
        });

        return res.status(201).json({ message: "Job posted successfully", job: newJob });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// GET /api/jobs/:id
// Get a single job by ID
const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate("employerId", "email fullName")
            .populate("companyId");
        if (!job) return res.status(404).json({ message: "Job not found" });
        return res.status(200).json({ job });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// PUT /api/jobs/:id
// Update a job (recruiter must own it)
const updateJob = async (req, res) => {
    try {
        const { id, role } = req.user;
        if (role !== "recruiter") {
            return res.status(403).json({ message: "Recruiter access required." });
        }

        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: "Job not found" });

        if (job.employerId.toString() !== id) {
            return res.status(403).json({ message: "You are not authorized to update this job." });
        }

        // Prevent changing employerId
        delete req.body.employerId;

        const updatedJob = await Job.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );

        return res.status(200).json({ message: "Job updated successfully", job: updatedJob });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// DELETE /api/jobs/:id
// Delete a job and all its applications (recruiter must own it)
const deleteJob = async (req, res) => {
    try {
        const { id, role } = req.user;
        if (role !== "recruiter") {
            return res.status(403).json({ message: "Recruiter access required." });
        }

        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: "Job not found" });

        if (job.employerId.toString() !== id) {
            return res.status(403).json({ message: "You are not authorized to delete this job." });
        }

        // Delete associated applications
        const Application = require("../models/Applications.model");
        await Application.deleteMany({ jobId: req.params.id });

        await job.deleteOne();
        return res.status(200).json({ message: "Job and all associated applications deleted successfully." });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// GET /api/jobs/employer-stats
// Get aggregate stats for the employer dashboard
const getEmployerStats = async (req, res) => {
    try {
        const { id, role } = req.user;
        if (role !== "recruiter") {
            return res.status(403).json({ message: "Recruiter access required." });
        }

        const Application = require("../models/Applications.model");

        const totalJobs = await Job.countDocuments({ employerId: id });
        const activeJobs = await Job.countDocuments({ employerId: id, status: "Active" });
        const closedJobs = await Job.countDocuments({ employerId: id, status: "Closed" });

        // Get all job IDs for this employer
        const employerJobIds = await Job.find({ employerId: id }).distinct("_id");

        const totalApplications = await Application.countDocuments({ jobId: { $in: employerJobIds } });
        const applied = await Application.countDocuments({ jobId: { $in: employerJobIds }, status: "Applied" });
        const shortlisted = await Application.countDocuments({ jobId: { $in: employerJobIds }, status: "Shortlisted" });
        const interviews = await Application.countDocuments({ jobId: { $in: employerJobIds }, status: "Interview" });
        const offer = await Application.countDocuments({ jobId: { $in: employerJobIds }, status: "Offer" });
        const hired = await Application.countDocuments({ jobId: { $in: employerJobIds }, status: "Hired" });
        const rejected = await Application.countDocuments({ jobId: { $in: employerJobIds }, status: "Rejected" });

        // Total views = sum of all job views for this employer's jobs
        const viewsResult = await Job.aggregate([
            { $match: { employerId: require("mongoose").Types.ObjectId.createFromHexString(id) } },
            { $group: { _id: null, totalViews: { $sum: { $ifNull: ["$views", 0] } } } }
        ]);
        const totalViews = viewsResult[0]?.totalViews || 0;

        return res.status(200).json({
            stats: {
                totalJobs,
                activeJobs,
                closedJobs,
                totalApplications,
                applied,
                shortlisted,
                interviews,
                offer,
                hired,
                rejected,
                totalViews,
            }
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// GET /api/jobs/recommended
// AI matching logic for candidates based on their parsed skills
const getRecommendedJobs = async (req, res) => {
    try {
        const { id, role } = req.user;
        if (role !== "candidate") {
            return res.status(403).json({ message: "Only candidates can receive recommendations." });
        }

        const candidate = await User.findById(id);
        if (!candidate.skills || candidate.skills.length === 0) {
            return res.status(200).json({ jobs: [], message: "Upload a resume or add skills to get recommendations." });
        }

        const candidateSkills = candidate.skills.map(s => s.toLowerCase());

        // Find jobs where at least one required skill matches candidate's skills
        const jobs = await Job.find({
            status: "Active",
            skillsRequired: { $in: candidate.skills.map(s => new RegExp(`^${s}$`, 'i')) }
        })
        .populate("employerId", "email fullName")
        .populate("companyId");

        // Calculate a compatibility match score
        const recommendedJobs = jobs.map(job => {
            const matchedSkills = job.skillsRequired.filter(skill => candidateSkills.includes(skill.toLowerCase()));
            const matchScore = Math.round((matchedSkills.length / job.skillsRequired.length) * 100);
            return {
                ...job.toObject(),
                matchScore
            };
        });

        // Sort by highest match score
        recommendedJobs.sort((a, b) => b.matchScore - a.matchScore);

        return res.status(200).json({ jobs: recommendedJobs });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getJobs,
    getJobById,
    createJob,
    updateJob,
    deleteJob,
    getEmployerStats,
    getRecommendedJobs
};
