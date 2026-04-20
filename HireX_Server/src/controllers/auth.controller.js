

// Login Controller 
const { userModel, AuthModel } = require("../models");
const { sendMail, generateOTP, generateJWTToken } = require("../utils/helperFunctions");
const { getRegistrationEmailTemplate, getLoginAlertEmailTemplate, getPasswordResetEmailTemplate } = require("../utils/emailTemplates");

const loginUser = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        // Hardcoded Admin Credentials Check
        if (email === "admin@hirex.com" && password === "admin@123") {
            const adminUser = {
                _id: "000000000000000000000000", // valid hex string format for ObjectId
                email: "admin@hirex.com",
                role: "admin",
                fullName: "Super Admin"
            };
            const jwt = require("jsonwebtoken");
            const accessToken = jwt.sign({ id: adminUser._id, email: adminUser.email, role: adminUser.role }, process.env.JWT_SECRET || "fallback_secret", { expiresIn: "7d" });
            
            return res.status(201).json({ token: accessToken, user: adminUser, message: "Admin Login successful" });
        }

        const user = await userModel.findOne({ email }).select("+password");
        if (!user) {
            return res.status(400).json({ message: "Account not found. Please register." });
        }
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials. Please check your email and password." });
        }
        
        // Validate user role (Admins can bypass portal check)
        if (role && user.role !== role && user.role !== "admin") {
             return res.status(403).json({ message: `Wrong portal. Switch toggle to ${user.role}.` });
        }

        // Generate JWT token
        const accessToken = user.generateAccessToken(user);
        const refreshToken = user.generateRefreshToken(user);

        const {password:pwd,...userData} = user.toObject();
        
        // Send Login Alert HTML Email (Non-blocking)
        const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress || "Unknown Device";
        const emailHtml = getLoginAlertEmailTemplate(user.fullName, user.role, ipAddress);
        sendMail({ to: user.email, subject: "New Login Detected - HireX", html: emailHtml }).catch(err => console.error("Login Mail Error:", err));

        return res
            .cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            })
            .cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
            })
            .status(201).json({ token: accessToken, user:userData , message: "Login successful" });
    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ message: "System error during login." });
    }
}

const registerUser = async (req, res) => {
    try {
        const { fullName, email, password, role } = req.body;
        const user = await userModel.findOne({ email });

        if (user) {
            return res.status(400).json({ message: "Account exists. Log in instead." });
        }

        const userRole = role || "candidate";
        const subscription = {
            plan: "free",
            isActive: true,
            interviewsPerDayLimit: userRole === "recruiter" ? 3 : 0,
            applyJobLimit: userRole === "candidate" ? 10 : 0
        };

        const newUser = await userModel.create({
            fullName,
            email,
            password,
            role: userRole,
            subscription
        });

        // Generate JWT token
        const accessToken = newUser.generateAccessToken(newUser);
        const refreshToken = newUser.generateRefreshToken(newUser);

        await AuthModel.create({
            user: newUser._id,
            accessToken,
            refreshToken,
            accessTokenExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            refreshTokenExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        })
        
        // Send Registration Welcome HTML Email (Non-blocking)
        const emailHtml = getRegistrationEmailTemplate(newUser.fullName, newUser.role);
        sendMail({ to: newUser.email, subject: "Welcome to HireX! 🎉", html: emailHtml }).catch(err => console.error("Registration Mail Error:", err));
        
        return res
            .status(201)
            .json({ user: newUser, message: "User registered successfully" });
    } catch (error) {
        console.error("Registration Error:", error);
       return res.status(500).json({ message: "Failed to create account." });
    }
}


const sendForgotPasswordEmail = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Account not found. Pls register." });
        }

        const OTP = generateOTP();

        // Save OTP directly to the user model, bypassing AuthModel requirements
        await userModel.updateOne(
            { _id: user._id },
            { 
                resetPasswordOtp: OTP, 
                resetPasswordOtpExpires: new Date(Date.now() + 15 * 60 * 1000) 
            }
        );

        const emailHtml = getPasswordResetEmailTemplate(OTP, user.role);
        await sendMail({ to: email, subject: "HireX Password Reset Code", html: emailHtml });
        
        res.status(200).json({ message: "Password reset email sent" });
    } catch (error) {
        console.error("Forgot Password Error:", error);
        res.status(500).json({ message: "Failed to send reset email." });
    }
}

const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Account not found. Pls register." });
        }
        
        if (!user.resetPasswordOtp || user.resetPasswordOtp !== otp || user.resetPasswordOtpExpires < new Date()) {
            return res.status(400).json({ message: "Code invalid or expired." });
        }
        
        // Clear OTP on successful validation
        await userModel.updateOne(
            { _id: user._id },
            { $unset: { resetPasswordOtp: 1, resetPasswordOtpExpires: 1 } }
        );
        
        const resetPasswordToken = generateJWTToken({ id: user._id }, "15m");
        res.status(200).json({ message: "OTP verified successfully", token : resetPasswordToken });
    } catch (error) {
        console.error("Verify OTP Error:", error);
        res.status(500).json({ message: "Validation error. Request new code." });
    }
}

const resetPassword = async (req, res) => {
    try {
        const { newPassword } = req.body;
        const { id } = req.user;

        if (!id) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const user = await userModel.findOne({ _id: id });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }   
        user.password = newPassword;
        await user.save();
        res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        console.error("Reset Password Error:", error);
        res.status(500).json({ message: "Failed to save password." });
    }   
}

const oauthLogin = async (req, res) => {
    try {
        const { provider, providerId, email, fullName, profilePicture } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required from OAuth provider." });
        }

        let user = await userModel.findOne({ email }).select("+password");
        let isNewUser = false;

        if (user) {
            // Existing user, update provider details if missing
            if (user.provider === "local" || !user.providerId) {
                user.provider = provider;
                user.providerId = providerId;
                await user.save();
            }
        } else {
            // New user via OAuth
            const userRole = "candidate"; // default
            const subscription = {
                plan: "free",
                isActive: true,
                interviewsPerDayLimit: 0,
                applyJobLimit: 10
            };
            user = await userModel.create({
                fullName,
                email,
                provider,
                providerId,
                profilePicture: profilePicture || "",
                role: userRole,
                isVerified: true,
                subscription
            });

            const accessToken = user.generateAccessToken(user);
            const refreshToken = user.generateRefreshToken(user);

            await AuthModel.create({
                user: user._id,
                accessToken,
                refreshToken,
                accessTokenExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                refreshTokenExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            });

            // Send Welcome Email
            const emailHtml = getRegistrationEmailTemplate(user.fullName, user.role);
            sendMail({ to: user.email, subject: "Welcome to HireX! 🎉", html: emailHtml }).catch(err => console.error("Registration Mail Error:", err));

            isNewUser = true;
        }

        const accessToken = user.generateAccessToken(user);
        const refreshToken = user.generateRefreshToken(user);

        const userData = user.toObject();
        delete userData.password;

        return res
            .cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            })
            .cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 30 * 24 * 60 * 60 * 1000,
            })
            .status(200).json({ token: accessToken, user: userData, isNewUser, message: "OAuth Login successful" });
    } catch (error) {
        console.error("OAuth Login Error:", error);
        return res.status(500).json({ message: "System error during OAuth login." });
    }
};

const oauthSetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        if (!email || !newPassword) {
            return res.status(400).json({ message: "Email and new password are required." });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // We can allow users to update password even if they have one already, but here we expect OAuth users
        user.password = newPassword;
        await user.save(); // pre-save hook handles hashing

        return res.status(200).json({ message: "Password set successfully. You can now login with email and password." });
    } catch (error) {
        console.error("OAuth Set Password Error:", error);
        return res.status(500).json({ message: "System error while setting password." });
    }
};

module.exports = {
    loginUser,
    registerUser,
    sendForgotPasswordEmail,
    verifyOTP,
    resetPassword,
    oauthLogin,
    oauthSetPassword
};