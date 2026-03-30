const User = require("../models/Users.model");
const pdf = require("pdf-parse");
const fs = require("fs");

const commonTechSkills = [
    "javascript", "python", "java", "c++", "c#", "ruby", "php", "typescript",
    "react", "angular", "vue", "node.js", "express", "django", "flask", "springboot",
    "mongodb", "postgresql", "mysql", "redis", "docker", "kubernetes", "aws", "azure",
    "gcp", "git", "linux", "html", "css", "tailwind", "next.js", "graphql", "rest api"
];

// POST /api/resume/upload
const uploadAndParseResume = async (req, res) => {
    try {
        const { id, role } = req.user;

        if (role !== "candidate") {
            return res.status(403).json({ error: "Only candidates can upload resumes." });
        }

        if (!req.file) {
            return res.status(400).json({ error: "No file provided." });
        }

        // Parse PDF for skills extraction by directly reading the local disk path written by Multer
        let extractedSkills = [];
        if (req.file.mimetype === "application/pdf") {
            try {
                const buffer = fs.readFileSync(req.file.path);
                const data = await pdf(buffer);
                const text = data.text.toLowerCase();

                commonTechSkills.forEach((skill) => {
                    // simple keyword matching
                    if (text.includes(skill.toLowerCase())) {
                        extractedSkills.push(skill);
                    }
                });
            } catch (err) {
                console.error("PDF Parsing Warning:", err.message);
            }
        }

        // Update User Profile with new local static resume URL and extracted skills
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        // Merge extracted skills with existing ones, avoiding duplicates
        const updatedSkills = Array.from(new Set([...user.skills.map(s => s.toLowerCase()), ...extractedSkills]));

        user.resumeUrl = `/uploads/resumes/${req.file.filename}`;
        user.skills = updatedSkills;
        await user.save();

        res.status(200).json({
            message: "Resume uploaded and parsed successfully.",
            resumeUrl: user.resumeUrl,
            extractedSkills,
            allSkills: user.skills
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    uploadAndParseResume
};
