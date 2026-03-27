const express = require("express");
const { getApplications, applyToJob, updateApplicationStatus } = require("../controllers/applications.controller");
const { verifyJWT } = require("../middlewares");

const applicationsRouter = express.Router();

applicationsRouter.get("/", verifyJWT, getApplications);
applicationsRouter.post("/", verifyJWT, applyToJob);
applicationsRouter.put("/", verifyJWT, updateApplicationStatus);

module.exports = applicationsRouter;
