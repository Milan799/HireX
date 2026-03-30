const mongoose = require("mongoose");
const Users = require("./src/models/Users.model");

mongoose.connect("mongodb://localhost:27017/hirex").then(async () => {
    try {
        const user = await Users.create({
            fullName: "Test User",
            email: "test3@test.com",
            password: "password123",
            role: "candidate"
        });
        console.log("Success:", user);
    } catch (err) {
        console.error("Error:", err.message);
    }
    process.exit();
}).catch(console.error);
