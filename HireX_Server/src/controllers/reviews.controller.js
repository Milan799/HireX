const Review = require("../models/Review.model");
const Company = require("../models/Company.model");

// POST /api/reviews
const addReview = async (req, res) => {
    try {
        const { companyId, rating, comment } = req.body;
        const candidateId = req.user.id;
        
        if (req.user.role !== "candidate") {
            return res.status(403).json({ message: "Only candidates can leave reviews." });
        }

        if (!companyId || !rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: "Invalid input. Rating must be 1-5." });
        }

        // Create review
        const review = await Review.create({
            candidateId,
            companyId,
            rating,
            comment,
        });

        // Calculate new average
        const allReviews = await Review.find({ companyId });
        const count = allReviews.length;
        const average = allReviews.reduce((acc, curr) => acc + curr.rating, 0) / count;

        // Update company
        await Company.findByIdAndUpdate(companyId, {
            "ratingStats.average": Number(average.toFixed(1)),
            "ratingStats.count": count,
        });

        // Update all related jobs so they can be sorted by rating
        const Job = require("../models/Jobs.model");
        await Job.updateMany({ companyId }, { companyRating: Number(average.toFixed(1)) });

        return res.status(201).json({ message: "Review submitted successfully", review });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// GET /api/reviews/company/:id
const getCompanyReviews = async (req, res) => {
    try {
        const { id } = req.params;
        const reviews = await Review.find({ companyId: id })
            .populate("candidateId", "fullName avatar")
            .sort({ createdAt: -1 });
            
        return res.status(200).json({ reviews });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    addReview,
    getCompanyReviews,
};
