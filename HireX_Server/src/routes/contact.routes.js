const express = require("express");
const { submitContactMessage } = require("../controllers/contact.controller");

const contactRouter = express.Router();

contactRouter.post("/", submitContactMessage);

module.exports = contactRouter;
