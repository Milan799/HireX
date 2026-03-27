const axios = require('axios');

async function testContact() {
    try {
        console.log("Sending contact POST request...");
        const res = await axios.post("http://localhost:3000/api/contact", {
            name: "John Doe",
            email: "john@example.com",
            message: "This is a test message to debug the API endpoint."
        });
        console.log("Success:", res.status, res.data);
    } catch (error) {
        console.log("Error:", error.response ? error.response.status : error.message);
        if (error.response) {
            console.log("Error Data:", error.response.data);
        }
    }
}
testContact();
