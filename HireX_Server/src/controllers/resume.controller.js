const User = require("../models/Users.model");
const pdf = require("pdf-parse");
const { cloudinary } = require("../configs/cloudinary");

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

        // 1. Upload file buffer to Cloudinary using a stream
        const uploadResponse = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: "hirex_resumes", resource_type: "auto" },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            stream.end(req.file.buffer);
        });

        // 2. Parse PDF for skills extraction
        let extractedSkills = [];
        if (req.file.mimetype === "application/pdf") {
            const data = await pdf(req.file.buffer);
            const text = data.text.toLowerCase();
            
            commonTechSkills.forEach((skill) => {
                // simple keyword matching
                if (text.includes(skill.toLowerCase())) {
                    extractedSkills.push(skill);
                }
            });
        }

        // 3. Update User Profile with new resume URL and extracted skills
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        // Merge extracted skills with existing ones, avoiding duplicates
        const updatedSkills = Array.from(new Set([...user.skills.map(s => s.toLowerCase()), ...extractedSkills]));

        user.resumeUrl = uploadResponse.secure_url;
        user.skills = updatedSkills;
        await user.save();

        res.status(200).json({
            message: "Resume uploaded and parsed successfully.",
            resumeUrl: uploadResponse.secure_url,
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
