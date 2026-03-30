const express = require("express");
const { getApplications, applyToJob, updateApplicationStatus } = require("../controllers/applications.controller");
const { verifyJWT, checkInterviewLimit } = require("../middlewares");

const applicationsRouter = express.Router();

applicationsRouter.get("/", verifyJWT, getApplications);
applicationsRouter.post("/", verifyJWT, applyToJob);
applicationsRouter.put("/", verifyJWT, checkInterviewLimit, updateApplicationStatus);

module.exports = applicationsRouter;
