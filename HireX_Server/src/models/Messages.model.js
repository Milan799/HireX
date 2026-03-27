const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
    {
        senderId: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
        receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
        content: { type: String, required: true },
        read: { type: Boolean, default: false },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Messages", messageSchema);
