const express = require("express");
const { getHomeData } = require("../controllers/home.controller");

const homeRouter = express.Router();

// Public route to get all home page data
homeRouter.get("/", getHomeData);

module.exports = homeRouter;
