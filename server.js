require("dotenv").config();

console.log("API Key Loaded:", !!process.env.GEMINI_API_KEY);

const express = require("express");
const { route } = require("./router");

const app = express();

app.use(express.json());

// Serve frontend files
app.use(express.static("public"));

app.post("/chat", async (req, res) => {
    try {
        const { message } = req.body;

        const response = await route(message);

        res.json(response);
    } catch (err) {
        console.error(err);

        res.status(500).json({
            error: "Internal Server Error"
        });
    }
});

app.listen(3000, () => {
    console.log("🚀 Server Running on http://localhost:3000");
});