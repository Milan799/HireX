const express = require("express");
const { getJobs, getJobById, createJob, updateJob, deleteJob, getEmployerStats, getRecommendedJobs } = require("../controllers/jobs.controller");
const { verifyJWT } = require("../middlewares");

const jobsRouter = express.Router();

// NOTE: /employer-stats must be defined BEFORE /:id to avoid route collision
jobsRouter.get("/employer-stats", verifyJWT, getEmployerStats);
jobsRouter.get("/recommended", verifyJWT, getRecommendedJobs);
jobsRouter.get("/", verifyJWT, getJobs);
jobsRouter.get("/:id", verifyJWT, getJobById);
jobsRouter.post("/", verifyJWT, createJob);
jobsRouter.put("/:id", verifyJWT, updateJob);
jobsRouter.delete("/:id", verifyJWT, deleteJob);

module.exports = jobsRouter;
