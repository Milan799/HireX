const Company = require("../models/Company.model");
const User = require("../models/Users.model");

// GET /api/company
const getCompany = async (req, res) => {
    try {
        const company = await Company.findOne({ recruiterId: req.user.id });
        if (!company) {
            return res.status(404).json({ message: "Company profile not found" });
        }
        res.status(200).json({ company });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST /api/company
const createOrUpdateCompany = async (req, res) => {
    try {
        const { id } = req.user;
        const { name, description, website, location, industry, logo } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Company name is required." });
        }

        let company = await Company.findOne({ recruiterId: id });

        if (company) {
            // Update existing
            company.name = name || company.name;
            company.description = description || company.description;
            company.website = website || company.website;
            company.location = location || company.location;
            company.industry = industry || company.industry;
            company.logo = logo || company.logo;
            await company.save();
        } else {
            // Create new
            company = await Company.create({
                recruiterId: id,
                name,
                description,
                website,
                location,
                industry,
                logo
            });

            // Update user to hold companyId
            await User.findByIdAndUpdate(id, { companyId: company._id });
        }

        res.status(200).json({ message: "Company profile saved successfully", company });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST /api/company/logo
const uploadLogo = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No logo file provided." });
        }
        
        // Since server serves /uploads static folder
        const logoUrl = `${process.env.API_URL || "http://localhost:5000"}/uploads/misc/${req.file.filename}`;
        
        const { id } = req.user;
        let company = await Company.findOne({ recruiterId: id });
        
        if (company) {
            company.logo = logoUrl;
            await company.save();
        } else {
            company = await Company.create({
                recruiterId: id,
                name: "Pending Company",
                description: "...",
                logo: logoUrl
            });
            await User.findByIdAndUpdate(id, { companyId: company._id });
        }
        
        return res.status(200).json({ message: "Logo updated successfully", logo: logoUrl, company });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getCompany,
    createOrUpdateCompany,
    uploadLogo
};
