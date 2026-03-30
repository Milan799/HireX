const axios = require('axios');
axios.post('http://localhost:5000/api/auth/register', {
    fullName: "Integration Test",
    email: "test.api@hirex.com",
    password: "password123",
    role: "recruiter"
}).then(res => {
    console.log("Registered:", res.data);
}).catch(err => {
    console.error("Failed:", err.response ? err.response.data : err.message);
});
