export default function Dashboard({ items = [], members = [], apartment }) {
  const needed = items.filter(i => i.status === "needed").length;
  const locked = items.filter(i => i.status === "locked").length;
  const bought = items.filter(i => i.status === "bought").length;
  const total  = items
    .filter(i => i.status === "bought")
    .reduce((s, i) => s + (i.cost || 0), 0);

  return (
    <div style={{ padding: 32 }}>
      <h1 style={{ margin: "0 0 4px 0", fontSize: 24 }}>
        📊 {apartment?.name || "Dashboard"}
      </h1>
      <p style={{ color: "#888", fontSize: 13, marginBottom: 28 }}>
        Code: <strong style={{ letterSpacing: 3, color: "#6366f1" }}>
          {apartment?.code}
        </strong>
        &nbsp;&nbsp;—&nbsp;&nbsp;Share this with roommates to join
      </p>

      {/* stat cards */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 36 }}>
        {[
          { label: "Needed",   value: needed, color: "#6366f1", icon: "📋" },
          { label: "Reserved", value: locked,  color: "#f59e0b", icon: "🔒" },
          { label: "Bought",   value: bought,  color: "#10b981", icon: "✅" },
          { label: "Spent ₹",  value: total,   color: "#3b82f6", icon: "💰" },
        ].map(s => (
          <div key={s.label} style={{
            background: s.color,
            color: "white",
            borderRadius: 16,
            padding: "20px 28px",
            minWidth: 140,
            textAlign: "center",
            boxShadow: `0 4px 20px ${s.color}44`
          }}>
            <div style={{ fontSize: 28 }}>{s.icon}</div>
            <div style={{ fontSize: 30, fontWeight: 800, lineHeight: 1.2 }}>{s.value}</div>
            <div style={{ fontSize: 13, marginTop: 4, opacity: 0.9 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* members */}
      <h2 style={{ fontSize: 18, marginBottom: 16 }}>
        👥 Roommates ({members.length})
      </h2>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {members.map((m, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 12,
            background: "white",
            borderRadius: 12,
            padding: "12px 18px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
            border: "1px solid #f0f0f0"
          }}>
            {m.photo
              ? <img src={m.photo} alt=""
                  style={{ width: 36, height: 36, borderRadius: "50%" }} />
              : <div style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: "#6366f1", color: "white",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 700, fontSize: 14
                }}>{m.name?.[0]}</div>
            }
            <div>
              <p style={{ margin: 0, fontWeight: 600, fontSize: 14 }}>{m.name}</p>
              <p style={{ margin: 0, fontSize: 11, color: "#888" }}>{m.email}</p>
            </div>
          </div>
        ))}
      </div>

      {/* recent activity */}
      {items.length > 0 && (
        <>
          <h2 style={{ fontSize: 18, margin: "32px 0 16px" }}>🕐 Recent Items</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[...items]
              .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
              .slice(0, 5)
              .map(item => (
                <div key={item.id} style={{
                  background: "white",
                  borderRadius: 10,
                  padding: "12px 18px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                  border: "1px solid #f0f0f0"
                }}>
                  <span style={{ fontWeight: 600 }}>{item.name}</span>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <span style={{ fontSize: 13, color: "#888" }}>₹{item.cost || 0}</span>
                    <span style={{
                      fontSize: 11, fontWeight: 700,
                      padding: "3px 10px", borderRadius: 20,
                      background: item.status === "bought" ? "#dcfce7"
                               : item.status === "locked" ? "#fef3c7" : "#ede9fe",
                      color: item.status === "bought" ? "#16a34a"
                           : item.status === "locked" ? "#d97706" : "#7c3aed"
                    }}>
                      {item.status}
                    </span>
                  </div>
                </div>
              ))
            }
          </div>
        </>
      )}
    </div>
  );
}
