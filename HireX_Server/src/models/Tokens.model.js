const mongoose = require("mongoose");
const authTokenSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        accessToken: {
            type: String,
            required: true,
        },

        refreshToken: {
            type: String,
            required: true,
        },
        otp: { type: String, default: null },
        otpExpiresAt: { type: Date, default: null },

        deviceInfo: {
            browser: String,
            os: String,
            ipAddress: String,
        },

        isRevoked: {
            type: Boolean,
            default: false,
        },

        accessTokenExpiresAt: {
            type: Date,
            required: true,
        },

        refreshTokenExpiresAt: {
            type: Date,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("AuthToken", authTokenSchema);
