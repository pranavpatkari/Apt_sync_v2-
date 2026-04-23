export default function Profile({ user, items = [] }) {
  const userName = user?.name || user;
  const mine     = items.filter(i => i.boughtBy === userName);
  const pending  = items.filter(i => i.lockedBy === userName && i.status === "locked");
  const total    = mine.reduce((s, i) => s + (i.cost || 0), 0);

  return (
    <div style={{ padding: 32 }}>
      <div style={{
        background: "white",
        borderRadius: 16,
        padding: 24,
        display: "flex",
        alignItems: "center",
        gap: 20,
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        marginBottom: 28,
        border: "1px solid #f0f0f0"
      }}>
        {user?.photo
          ? <img src={user.photo} alt=""
              style={{ width: 64, height: 64, borderRadius: "50%", border: "3px solid #6366f1" }} />
          : <div style={{
              width: 64, height: 64, borderRadius: "50%",
              background: "#6366f1", color: "white",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 28, fontWeight: 700
            }}>{userName?.[0]}</div>
        }
        <div>
          <h1 style={{ margin: 0, fontSize: 22 }}>{userName}</h1>
          <p style={{ margin: "4px 0 0", color: "#888", fontSize: 13 }}>{user?.email}</p>
        </div>
        <div style={{ marginLeft: "auto", textAlign: "right" }}>
          <p style={{ margin: 0, fontSize: 28, fontWeight: 800, color: "#6366f1" }}>₹{total}</p>
          <p style={{ margin: 0, fontSize: 12, color: "#888" }}>total spent</p>
        </div>
      </div>

      {pending.length > 0 && (
        <>
          <h2 style={{ fontSize: 16, marginBottom: 12 }}>🔒 You Reserved ({pending.length})</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 28 }}>
            {pending.map((i, idx) => (
              <div key={idx} style={{
                background: "#fef3c7", border: "1px solid #f59e0b",
                borderRadius: 10, padding: "10px 16px",
                display: "flex", justifyContent: "space-between"
              }}>
                <span style={{ fontWeight: 600 }}>{i.name}</span>
                <span style={{ color: "#d97706", fontWeight: 700 }}>₹{i.cost}</span>
              </div>
            ))}
          </div>
        </>
      )}

      <h2 style={{ fontSize: 16, marginBottom: 12 }}>✅ Purchase History ({mine.length})</h2>
      {mine.length === 0
        ? <p style={{ color: "#888" }}>Nothing bought yet.</p>
        : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {mine.map((i, idx) => (
              <div key={idx} style={{
                background: "white", border: "1px solid #f0f0f0",
                borderRadius: 10, padding: "10px 16px",
                display: "flex", justifyContent: "space-between",
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)"
              }}>
                <span style={{ fontWeight: 600 }}>{i.name}</span>
                <span style={{ color: "#10b981", fontWeight: 700 }}>₹{i.cost}</span>
              </div>
            ))}
          </div>
        )
      }
    </div>
  );
}
