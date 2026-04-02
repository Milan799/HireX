const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["candidate", "recruiter", "admin"],
      default: "candidate",
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    profilePicture: {
      type: String,
      default: "",
    },

    about: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    provider: {
      type: String,
      enum: ["local", "google", "github"],
      default: "local",
    },

    providerId: {
      type: String,
    },

    password: {
      type: String,
      required: function() {
        return this.provider === 'local';
      },
      select: false,
    },

    location: {
      country: String,
      city: String,
      relocationOpen: {
        type: Boolean,
        default: false,
      },
      remoteOnly: {
        type: Boolean,
        default: false,
      },
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other", "Prefer not to say"],
    },

    experienceYears: {
      type: Number,
      default: 0,
    },

    skills: [
      {
        type: String,
        lowercase: true,
        trim: true,
      },
    ],

    preferredRoles: [String],

    expectedSalaryEUR: {
      min: Number,
      max: Number,
    },

    resume: {
      url: String,
      parsedText: String,
    },

    experience: [
      {
        title: String,
        company: String,
        startDate: Date,
        endDate: Date,
        current: { type: Boolean, default: false },
        description: String,
      },
    ],

    education: [
      {
        degree: String,
        institution: String,
        startDate: Date,
        endDate: Date,
        current: { type: Boolean, default: false },
      },
    ],

    resumeUrl: String,

    // Recruiter Fields
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
    phone: String,
    bio: String,
    website: String,

    kycStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },
    kycCompleted: {
      type: Boolean,
      default: false,
    },


    // Notification Preferences (stored as a map)
    notificationPreferences: {
      newApplications: { type: Boolean, default: true },
      candidateMessages: { type: Boolean, default: true },
      weeklyNewsletter: { type: Boolean, default: false },
      accountAlerts: { type: Boolean, default: true },
    },

    profileCompletion: {
      type: Number,
      default: 0,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    resetPasswordOtp: String,
    resetPasswordExpires: {
      type: Date,
    },
    subscription: {
      plan: {
        type: String,
        enum: ["free", "pro"],
        default: "free",
      },
      billingCycle: {
        type: String,
        enum: ["monthly", "yearly"],
      },
      startDate: {
        type: Date,
      },
      endDate: {
        type: Date,
      },
      interviewsPerDayLimit: {
        type: Number,
        default: 3,
      },
      isActive: {
        type: Boolean,
        default: true,
      },
    },
    usage: {
      interviewsToday: {
        type: Number,
        default: 0,
      },
      lastResetDate: {
        type: Date,
        default: Date.now,
      },
    },

    lastLoginAt: Date,
  },
  { timestamps: true }
);

/* PASSWORD HASH MIDDLEWARE */
userSchema.pre("save", async function () {
  // Hash only if password is new or modified, and exists
  if (!this.isModified("password") || !this.password) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// METHODS OF USER SCHEMA 
userSchema.methods.comparePassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateAccessToken = function (user) {
  const jwt = require("jsonwebtoken");

  return jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET || "fallback_secret", { expiresIn: "7d" });
};

userSchema.methods.generateRefreshToken = function (user) {
  const jwt = require("jsonwebtoken");

  return jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET || "fallback_secret", { expiresIn: "30d" });
};

module.exports = mongoose.model("Users", userSchema);
