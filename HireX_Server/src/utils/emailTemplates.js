// src/utils/emailTemplates.js

const getThemeColor = (role) => {
    return role === "recruiter" ? "#7c3aed" : "#2563eb"; // Deep Purple for recruiter, Deep Blue for candidate
};

const getRoleText = (role) => {
    return role === "recruiter" ? "Employer / Recruiter" : "Job Seeker";
};

const getBaseTemplate = (title, content, role) => {
    const themeColor = getThemeColor(role);
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
        .email-container { width: 100%; padding: 40px 20px; background-color: #f1f5f9; }
        .email-body { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025); }
        .header { background: linear-gradient(135deg, ${themeColor} 0%, ${themeColor}e6 100%); padding: 48px 40px; text-align: center; }
        .logo-text { color: #ffffff; margin: 0; font-size: 36px; font-weight: 800; letter-spacing: -1px; text-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .logo-dot { color: #38bdf8; }
        .portal-name { color: rgba(255,255,255,0.85); margin: 8px 0 0 0; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; }
        .content { padding: 48px 40px; color: #334155; font-size: 16px; line-height: 1.6; }
        .footer { background-color: #f8fafc; padding: 32px 40px; text-align: center; border-top: 1px solid #e2e8f0; }
        .footer p { margin: 0 0 12px 0; color: #64748b; font-size: 13px; }
        .footer a { color: ${themeColor}; text-decoration: none; font-size: 13px; font-weight: 600; }
        .footer-links { margin-bottom: 20px; }
        .footer-links span { color: #cbd5e1; margin: 0 10px; }
        .copyright { margin: 0; color: #94a3b8; font-size: 12px; font-weight: 500; }
        @media only screen and (max-width: 600px) {
            .email-container { padding: 20px 10px; }
            .header { padding: 40px 20px; }
            .content { padding: 40px 20px; }
            .footer { padding: 32px 20px; }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-body">
            <!-- Header -->
            <div class="header">
                <h1 class="logo-text">HireX<span class="logo-dot">.</span></h1>
                <p class="portal-name">${getRoleText(role)} Platform</p>
            </div>
            
            <!-- Content -->
            <div class="content">
                ${content}
            </div>
            
            <!-- Footer -->
            <div class="footer">
                <p><strong>Need assistance?</strong> Contact our dedicated support team at support@hirex.com</p>
                <div class="footer-links">
                    <a href="#">Help Center</a>
                    <span>|</span>
                    <a href="#">Privacy Policy</a>
                    <span>|</span>
                    <a href="#">Terms of Service</a>
                </div>
                <p class="copyright">&copy; ${new Date().getFullYear()} HireX Technologies. Delivering Premium Talent Experiences.</p>
            </div>
        </div>
    </div>
</body>
</html>
    `;
};

const getRegistrationEmailTemplate = (fullName, role) => {
    const themeColor = getThemeColor(role);
    const isRecruiter = role === "recruiter";

    const roleSpecificIntro = isRecruiter
        ? "Welcome to HireX, the premier destination for connecting with elite talent. We've equipped your account with state-of-the-art ATS tools to streamline your hiring pipeline and discover your next great hire."
        : "Welcome to HireX! Your journey toward securing your dream position begins today. We connect ambitious professionals like you with leading global enterprises actively seeking your skills.";

    const roleSpecificCTA = isRecruiter ? "Post Your First Vacancy" : "Complete Your Profile Portfolio";

    const content = `
        <h2 style="margin: 0 0 20px 0; color: #0f172a; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">Welcome aboard, ${fullName}.</h2>
        <p style="margin: 0 0 32px 0;">${roleSpecificIntro}</p>
        
        <div style="background-color: #f8fafc; border-left: 4px solid ${themeColor}; padding: 20px 24px; border-radius: 0 12px 12px 0; margin-bottom: 36px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
            <p style="margin: 0 0 6px 0; font-weight: 700; color: #1e293b; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Strategic Insight</p>
            <p style="margin: 0; font-size: 15px; color: #475569; line-height: 1.5;">
                ${isRecruiter
            ? "Employers with fully branded company profiles observe a <b>300%</b> increase in premium candidate applications."
            : "Candidates showcasing a comprehensive portfolio and completed resume are <b>4x</b> more likely to secure an interview."}
            </p>
        </div>

        <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
                <td align="center">
                    <a href="http://localhost:3000/auth/login" style="display: inline-block; background-color: ${themeColor}; color: #ffffff; text-decoration: none; padding: 16px 36px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 14px 0 ${themeColor}60; transition: all 0.2s ease;">${roleSpecificCTA} &rarr;</a>
                </td>
            </tr>
        </table>
        
        <p style="margin: 36px 0 0 0; font-size: 15px; color: #64748b;">Best regards,<br><strong style="color: #334155;">The HireX Leadership Team</strong></p>
    `;

    return getBaseTemplate("Welcome to HireX – Your Account is Ready", content, role);
};

const getLoginAlertEmailTemplate = (fullName, role, ipAddress = "New Device") => {
    const themeColor = getThemeColor(role);
    const content = `
        <h2 style="margin: 0 0 20px 0; color: #0f172a; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">Security Notice: Account Access</h2>
        <p style="margin: 0 0 24px 0;">Dear ${fullName},</p>
        <p style="margin: 0 0 28px 0;">We have detected a recent login to your HireX <strong>${getRoleText(role)}</strong> workspace. Please review the access details below to verify this activity.</p>
        
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 24px; border-radius: 12px; margin-bottom: 32px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                    <td width="30%" style="padding-bottom: 12px;"><strong style="color: #1e293b; font-size: 14px;">Date & Time:</strong></td>
                    <td width="70%" style="padding-bottom: 12px; color: #475569; font-size: 15px;">${new Date().toLocaleString('en-US', { timeZoneName: 'short' })}</td>
                </tr>
                <tr>
                    <td><strong style="color: #1e293b; font-size: 14px;">IP / Device:</strong></td>
                    <td style="color: #475569; font-size: 15px;">${ipAddress}</td>
                </tr>
            </table>
        </div>

        <p style="margin: 0 0 12px 0; font-size: 15px; font-weight: 600; color: #1e293b;">Was this you?</p>
        <p style="margin: 0 0 28px 0; font-size: 15px; color: #475569;">If you initiated this login, no further action is necessary. If you do not recognize this activity, please secure your account immediately.</p>

        <a href="http://localhost:3000/auth/login" style="display: inline-block; color: ${themeColor}; text-decoration: none; font-weight: 600; font-size: 15px; border-bottom: 2px solid ${themeColor}; padding-bottom: 2px;">Review Account Security &rarr;</a>
    `;

    return getBaseTemplate("Security Alert: HireX Login Detected", content, role);
};

const getPasswordResetEmailTemplate = (otp, role = "candidate") => {
    const themeColor = getThemeColor(role);
    const content = `
        <div style="text-align: center;">
            <div style="display: inline-flex; align-items: center; justify-content: center; width: 56px; height: 56px; border-radius: 50%; background-color: #fef2f2; margin-bottom: 24px;">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
            </div>
            
            <h2 style="margin: 0 0 16px 0; color: #0f172a; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">Authorization Required</h2>
            <p style="margin: 0 0 32px 0; color: #475569; font-size: 16px; line-height: 1.6;">We received a formalized request to originate a password reset for your HireX workspace. Please utilize the Secure Authorization Code below to proceed natively.</p>
            
            <div style="margin: 0 auto 36px auto; max-width: 320px;">
                <div style="background-color: #f8fafc; border: 2px solid #e2e8f0; border-radius: 12px; padding: 24px; text-align: center; letter-spacing: 10px; box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.02);">
                    <span style="font-size: 40px; font-weight: 800; color: ${themeColor}; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; line-height: 1;">${otp}</span>
                </div>
            </div>
            
            <p style="margin: 0 0 24px 0; color: #64748b; font-size: 14px;">This cryptographic code will strictly expire in <strong>15 minutes</strong>. If you did not command this execution, you may safely ignore this notification and your credentials will remain fully intact.</p>
        </div>
    `;

    return getBaseTemplate("Action Required: HireX Password Reset Code", content, role);
};

module.exports = {
    getRegistrationEmailTemplate,
    getLoginAlertEmailTemplate,
    getPasswordResetEmailTemplate
};
