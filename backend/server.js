require("dotenv").config();

const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();

// 🔐 Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173"
}));
app.use(express.json());

// 🔥 RATE LIMIT (anti-spam)
const requestLog = {};
const LIMIT = 5;

function rateLimiter(req, res, next) {
  const ip = req.ip;
  const now = Date.now();

  if (!requestLog[ip]) requestLog[ip] = [];

  requestLog[ip] = requestLog[ip].filter(t => now - t < 60000);

  if (requestLog[ip].length >= LIMIT) {
    return res.status(429).json({ error: "Too many requests 🚫" });
  }

  requestLog[ip].push(now);
  next();
}

// 📧 TRANSPORTER (FINAL FIXED)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,              // 🔥 TLS works better than 465 sometimes
  secure: false,
  authMethod: "LOGIN",    // 🔥 IMPORTANT FIX
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// ✅ VERIFY CONNECTION
transporter.verify((err) => {
  if (err) {
    console.error("❌ SMTP ERROR:", err.message);
  } else {
    console.log("✅ SMTP READY");
  }
});

// 🧠 EMAIL VALIDATION
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const cleanEmails = (emails) => {
  return emails.filter(e => isValidEmail(e));
};

// 🏠 HEALTH CHECK
app.get("/", (req, res) => {
  res.send("AptSync backend running ✅");
});

// 🚀 SEND EMAIL
app.post("/send-email", rateLimiter, async (req, res) => {
  const { emails, subject, message } = req.body;

  if (!emails || !Array.isArray(emails)) {
    return res.status(400).json({ error: "Emails must be array" });
  }

  const validEmails = cleanEmails(emails);

  if (validEmails.length === 0) {
    return res.status(400).json({ error: "No valid emails" });
  }

  if (!message || message.trim().length < 3) {
    return res.status(400).json({ error: "Message too short" });
  }

  try {
    const info = await transporter.sendMail({
      from: `"AptSync 🏠" <${process.env.EMAIL_USER}>`,
      to: validEmails.join(","),
      subject: subject || "AptSync Update 🚀",
      html: `
        <div style="font-family:sans-serif;max-width:500px;margin:auto;padding:20px">
          <h2 style="color:#6366f1">🏠 AptSync</h2>
          <p>${message}</p>

          <hr style="margin:20px 0"/>

          <small style="color:#888">
            This is an automated apartment notification.
          </small>
        </div>
      `
    });

    console.log("✅ Email sent:", info.messageId);

    res.json({
      success: true,
      sent: validEmails.length
    });

  } catch (err) {
    console.error("❌ Email error:", err.message);

    res.status(500).json({
      error: "Failed to send email",
      details: err.message
    });
  }
});

// 🔐 SEND JOIN CODE
app.post("/send-code", rateLimiter, async (req, res) => {
  const { email, code, apartmentName } = req.body;

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: "Invalid email" });
  }

  if (!code) {
    return res.status(400).json({ error: "No code provided" });
  }

  try {
    await transporter.sendMail({
      from: `"AptSync 🏠" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Apartment Code 🔐",
      html: `
        <div style="font-family:sans-serif;text-align:center">
          <h2>🏠 ${apartmentName || "AptSync"}</h2>
          <p>Your join code:</p>
          <h1 style="letter-spacing:5px;color:#6366f1">${code}</h1>
        </div>
      `
    });

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send code" });
  }
});

// 🔥 GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  console.error("🔥 SERVER ERROR:", err);
  res.status(500).json({ error: "Internal server error" });
});

// 🚀 START SERVER
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running → http://localhost:${PORT}`);
});
