const express    = require("express");
const nodemailer = require("nodemailer");
const cors       = require("cors");
require("dotenv").config();

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());

// ── Nodemailer transporter ────────────────────────────────
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS   // use Gmail App Password
  }
});

// ── Health check ─────────────────────────────────────────
app.get("/", (req, res) => res.send("AptSync backend running ✅"));

// ── Send email notification ───────────────────────────────
app.post("/send-email", async (req, res) => {
  const { emails, subject, message } = req.body;

  if (!emails || !Array.isArray(emails) || emails.length === 0) {
    return res.status(400).json({ error: "No recipients provided" });
  }
  if (!message) {
    return res.status(400).json({ error: "No message provided" });
  }

  try {
    await transporter.sendMail({
      from: `"AptSync" <${process.env.EMAIL_USER}>`,
      to: emails.join(","),
      subject: subject || "AptSync Update 🏠",
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:auto">
          <h2 style="color:#6366f1">🏠 AptSync</h2>
          <p>${message}</p>
          <hr/>
          <p style="font-size:12px;color:#aaa">
            You received this because you're a member of an AptSync apartment.
          </p>
        </div>
      `
    });
    res.json({ success: true, sent: emails.length });
  } catch (err) {
    console.error("Email error:", err.message);
    res.status(500).json({ error: "Failed to send email" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
