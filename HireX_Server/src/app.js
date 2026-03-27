require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const connectDB = require("./configs/db");
const cors = require("cors");

const app = express();

// COnnect Database
connectDB();

app.use(express.json());
app.use(cors({ origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"], credentials: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const authRouter = require("./routes/auth.routes");
const jobsRouter = require("./routes/jobs.routes");
const applicationsRouter = require("./routes/applications.routes");
const profileRouter = require("./routes/profile.routes");
const contactRouter = require("./routes/contact.routes");
const homeRouter = require("./routes/home.routes");
const settingsRouter = require("./routes/settings.routes");
const companyRouter = require("./routes/company.routes");
const resumeRouter = require("./routes/resume.routes");
const chatRouter = require("./routes/chat.routes");
const adminRouter = require("./routes/admin.routes");

app.use("/api/auth", authRouter);
app.use("/api/jobs", jobsRouter);
app.use("/api/applications", applicationsRouter);
app.use("/api/profile", profileRouter);
app.use("/api/contact", contactRouter);
app.use("/api/home", homeRouter);
app.use("/api/settings", settingsRouter);
app.use("/api/company", companyRouter);
app.use("/api/resume", resumeRouter);
app.use("/api/chat", chatRouter);
app.use("/api/admin", adminRouter);

module.exports = app;
