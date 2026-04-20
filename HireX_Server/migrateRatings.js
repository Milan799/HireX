const mongoose = require("mongoose");
const Job = require("./src/models/Jobs.model");
const Company = require("./src/models/Company.model");
require("dotenv").config({ path: "./.env" });

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to DB");
    const jobs = await Job.find({});
    for (let job of jobs) {
      if (!job.companyRating) {
        const company = await Company.findById(job.companyId);
        job.companyRating = company?.ratingStats?.average || 0;
        await job.save();
      }
    }
    console.log("Migration complete.");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
