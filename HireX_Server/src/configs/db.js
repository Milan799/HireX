const mongoose = require("mongoose");

const connectDB = async () => {
    try {
    if (process.env.NODE_ENV === "development") {
        mongoose.set("debug", function (collection, method, query, doc) {
            console.log(
                `🟡 ${collection}.${method}`,
                JSON.stringify(query),
                doc
            );
        });
    }
        const conn = await mongoose.connect(process.env.MONGODB_URI);

        console.log(
            `✅ MongoDB Connected: ${conn.connection.host}`
        );
    } catch (error) {
        console.error(" MongoDB connection error:", error.message);
        process.exit(1); // Stop app if DB fails
    }
};

module.exports = connectDB;
