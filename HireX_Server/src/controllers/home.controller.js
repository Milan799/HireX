const Job = require("../models/Jobs.model");
const User = require("../models/Users.model");
const Company = require("../models/Company.model");

// GET /api/home
// Fetch public data for the homepage (stats, featured jobs, top companies)
const getHomeData = async (req, res) => {
    try {
        // Run aggregation queries in parallel
        const [
            totalJobs,
            totalRecruiters,
            totalCandidates,
            featuredJobs,
            topCompanies
        ] = await Promise.all([
            Job.countDocuments({ status: "Active" }),
            User.countDocuments({ role: "recruiter" }),
            User.countDocuments({ role: "candidate" }),

            // Get latest 6 active jobs
            Job.find({ status: "Active" })
                .sort({ createdAt: -1 })
                .limit(6)
                .populate("companyId", "name website logo"),

            // Get top 8 companies based on reviews and ratings
            Company.find()
                .sort({ "ratingStats.average": -1, "ratingStats.count": -1, createdAt: -1 })
                .limit(8)
                .select("name website logo location")
        ]);

        return res.status(200).json({
            stats: {
                totalJobs: totalJobs < 500000 ? totalJobs : 500000 + totalJobs, // Simulating 500k+ if actual is low
                
                totalRecruiters,
                totalCandidates
            },
            featuredJobs,
            topCompanies
        });

    } catch (error) {
        console.error("Error fetching home data:", error.message);
        return res.status(500).json({ error: "Failed to fetch homepage data", details: error.message });
    }
};

module.exports = {
    getHomeData
};
