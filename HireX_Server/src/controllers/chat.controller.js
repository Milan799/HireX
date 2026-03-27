const Message = require("../models/Messages.model");
const User = require("../models/Users.model");

// GET /api/chat/:userId
// Fetch message history with a specific user
const getChatHistory = async (req, res) => {
    try {
        const { id } = req.user;
        const otherUserId = req.params.userId;

        const messages = await Message.find({
            $or: [
                { senderId: id, receiverId: otherUserId },
                { senderId: otherUserId, receiverId: id }
            ]
        }).sort({ createdAt: 1 });

        // Mark incoming messages as read
        await Message.updateMany(
            { senderId: otherUserId, receiverId: id, read: false },
            { $set: { read: true } }
        );

        res.status(200).json({ messages });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET /api/chat/conversations
// Get a list of users the current user has chatted with
const getConversations = async (req, res) => {
    try {
        const { id } = req.user;

        // Find all unique users this user has sent to or received from
        const messages = await Message.find({
            $or: [{ senderId: id }, { receiverId: id }]
        }).sort({ createdAt: -1 });

        const activeChats = new Map();

        messages.forEach(msg => {
            const partnerId = msg.senderId.toString() === id ? msg.receiverId.toString() : msg.senderId.toString();
            if (!activeChats.has(partnerId)) {
                activeChats.set(partnerId, msg);
            }
        });

        // We could populate user info, but since it's an aggregation map, we fetch the partner details manually
        const partnerIds = Array.from(activeChats.keys());
        const partners = await User.find({ _id: { $in: partnerIds } })
            .select("fullName email role profileImage");

        const conversations = partners.map(partner => ({
            user: partner,
            lastMessage: activeChats.get(partner._id.toString())
        })).sort((a, b) => new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt));

        res.status(200).json({ conversations });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getChatHistory,
    getConversations
};
