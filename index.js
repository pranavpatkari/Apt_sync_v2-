const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "your@gmail.com",
    pass: "your_app_password"
  }
});

exports.notifyAll = functions.firestore
  .document("items/{itemId}")
  .onUpdate(async (change, context) => {

    const before = change.before.data();
    const after = change.after.data();

    if (before.status === after.status) return;

    const snap = await admin.firestore().collection("members").get();

    const emails = [];

    snap.forEach(doc => {
      if (doc.data().email) {
        emails.push(doc.data().email);
      }
    });

    if (emails.length === 0) return;

    await transporter.sendMail({
      from: "your@gmail.com",
      to: emails.join(","),
      subject: "AptSync Update 🚀",
      text: `${after.lockedBy || after.boughtBy} updated ${after.name} (${after.status})`
    });

    console.log("Emails sent 🚀");
  });
