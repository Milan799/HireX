fetch("http://localhost:3000/api/contact", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "Test", email: "test@example.com", message: "This is a test message to debug the API endpoint." })
}).then(async res => {
   console.log("Status:", res.status);
   console.log("Data:", await res.json());
}).catch(console.error);
