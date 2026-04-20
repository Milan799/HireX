const Razorpay = require("razorpay");
const crypto = require("crypto");
const Payment = require("../models/Payment.model");
const Users = require("../models/Users.model");

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = async (req, res) => {
    try {
        const { plan, billingCycle } = req.body;
        let amount = 0;

        if (plan === "pro" && billingCycle === "monthly") {
            amount = 999; // Rs 999
        } else if (plan === "pro" && billingCycle === "yearly") {
            amount = 9990; // Rs 9990
        } else {
            return res.status(400).json({ success: false, message: "Invalid plan or billing cycle." });
        }

        const options = {
            amount: amount * 100, // Razorpay takes amounts in paise
            currency: "INR",
            receipt: `receipt_order_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);
        if (!order) {
            return res.status(500).json({ success: false, message: "Error creating Razorpay order" });
        }

        // Pre-record the payment attempt
        const payment = await Payment.create({
            recruiterId: req.user.id,
            razorpay_order_id: order.id,
            amount: amount,
            currency: "INR",
            status: "created",
            plan,
            billingCycle
        });

        res.status(200).json({ success: true, order, paymentId: payment._id });
    } catch (error) {
        console.error("Razorpay Order Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan, billingCycle } = req.body;
        const userId = req.user.id;

        const shasum = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
        shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
        const digest = shasum.digest("hex");

        if (digest !== razorpay_signature) {
            // Mark payment failed
            await Payment.findOneAndUpdate({ razorpay_order_id }, { status: "failed" });
            return res.status(400).json({ success: false, message: "Transaction not legitimate!" });
        }

        // Transaction is legitimate
        await Payment.findOneAndUpdate(
            { razorpay_order_id },
            { razorpay_payment_id, razorpay_signature, status: "success" }
        );

        // Calculate dates
        const startDate = new Date();
        const endDate = new Date();
        if (billingCycle === "monthly") endDate.setMonth(endDate.getMonth() + 1);
        if (billingCycle === "yearly") endDate.setFullYear(endDate.getFullYear() + 1);

        const userToUpdate = await Users.findById(userId);
        const isRecruiter = userToUpdate?.role === "recruiter";

        // Upgrade User Subscription
        const updatedUser = await Users.findByIdAndUpdate(userId, {
            "subscription.plan": "pro",
            "subscription.billingCycle": billingCycle,
            "subscription.startDate": startDate,
            "subscription.endDate": endDate,
            "subscription.interviewsPerDayLimit": isRecruiter ? 10 : 0,
            "subscription.applyJobLimit": !isRecruiter ? 999999 : 0,
            "subscription.isActive": true
        }, { new: true }).select("-password");

        res.status(200).json({ success: true, message: "Payment successful, account upgraded to Pro!", user: updatedUser });
    } catch (error) {
        console.error("Razorpay Verify Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
