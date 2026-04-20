const { Server } = require("socket.io");
const Message = require("./models/Messages.model");

let io;
// Map to keep track of connected users: { userId: socketId }
const onlineUsers = new Map();

const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: ["http://localhost:3000", "http://127.0.0.1:3001"],
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", (socket) => {
        console.log(`🔌 Client connected: ${socket.id}`);

        socket.on("join", (userId) => {
            if (userId) {
                onlineUsers.set(userId, socket.id);
                console.log(`User ${userId} is online`);
                io.emit("updateUserStatus", { userId, status: "online" });
            }
        });

        socket.on("sendMessage", async (data) => {
            try {
                const { senderId, receiverId, content } = data;

                // Save message to DB
                const message = await Message.create({ senderId, receiverId, content });

                // Emit to receiver if online
                const receiverSocketId = onlineUsers.get(receiverId);
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit("receiveMessage", message);
                }

                // Acknowledge sender
                socket.emit("messageSent", message);
            } catch (error) {
                console.error("Socket Send Message Error:", error);
            }
        });

        socket.on("disconnect", () => {
            let disconnectedUserId = null;
            for (let [userId, socketId] of onlineUsers.entries()) {
                if (socketId === socket.id) {
                    disconnectedUserId = userId;
                    onlineUsers.delete(userId);
                    break;
                }
            }
            if (disconnectedUserId) {
                console.log(`User ${disconnectedUserId} went offline`);
                io.emit("updateUserStatus", { userId: disconnectedUserId, status: "offline" });
            }
            console.log(`🛑 Client disconnected: ${socket.id}`);
        });
    });

    return io;
};

const getIo = () => {
    if (!io) {
        throw new Error("Socket.io is not initialized!");
    }
    return io;
};

const getOnlineUsers = () => {
    return onlineUsers;
};

module.exports = { initSocket, getIo, getOnlineUsers };
