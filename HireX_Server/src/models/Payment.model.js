const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    recruiterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },
    razorpay_order_id: {
        type: String,
        required: true,
    },
    razorpay_payment_id: {
        type: String,
    },
    razorpay_signature: {
        type: String,
    },
    amount: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        default: "INR",
    },
    status: {
        type: String,
        enum: ["created", "success", "failed"],
        default: "created",
    },
    plan: {
        type: String,
        enum: ["pro"],
        required: true,
    },
    billingCycle: {
        type: String,
        enum: ["monthly", "yearly"],
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);
