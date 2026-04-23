const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

// 🔐 Gmail transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "uluffy06@gmail.com",
    pass: "evxwighqsicrmahu"
  }
});

exports.notifyAll = functions.firestore
  .document("items/{itemId}")
  .onUpdate(async (change, context) => {

    const before = change.before.data();
    const after = change.after.data();

    // 🔥 only trigger on status change
    if (before.status === after.status) return;

    // 🔥 get all members
    const snap = await admin.firestore().collection("members").get();

    const emails = [];

    snap.forEach(doc => {
      const data = doc.data();
      if (data.email) emails.push(data.email);
    });

    if (emails.length === 0) return;

    try {
      await transporter.sendMail({
        from: "your@gmail.com",
        to: emails.join(","),
        subject: "AptSync Update 🚀",
        text: `${after.lockedBy || after.boughtBy} updated ${after.name} (${after.status})`
      });

      console.log("Emails sent 🚀");

    } catch (err) {
      console.error("Email error:", err);
    }
  });
