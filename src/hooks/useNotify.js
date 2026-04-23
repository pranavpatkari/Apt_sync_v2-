// sends email notification to all members EXCEPT the actor
export default function useNotify() {
  const notify = async ({ members, actorEmail, message }) => {
    const targets = (members || [])
      .map(m => m.email)
      .filter(e => e && e !== actorEmail);

    if (targets.length === 0) return;

    try {
      await fetch("http://localhost:5000/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emails: targets, message })
      });
    } catch (err) {
      // silent fail — notifications are non-critical
      console.warn("Notification failed (non-critical):", err.message);
    }
  };

  return { notify };
}
