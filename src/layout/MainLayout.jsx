import { useState } from "react";

const NAV = [
  { label: "📊 Dashboard", key: "dashboard" },
  { label: "🛒 Items",     key: "items"     },
  { label: "📈 Stats",     key: "stats"     },
  { label: "👤 Profile",   key: "profile"   },
];

export default function MainLayout({
  children, setPage, currentPage,
  user, apartment, apartments,
  switchApartment, onLogout
}) {
  const [showApts, setShowApts] = useState(false);

  const base = {
    padding: "10px 14px",
    borderRadius: 8,
    cursor: "pointer",
    marginBottom: 4,
    fontWeight: 500,
    fontSize: 14,
    transition: "background 0.15s",
    background: "rgba(255,255,255,0.06)"
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "system-ui, sans-serif" }}>

      {/* ── Sidebar ── */}
      <div style={{
        width: 220,
        minHeight: "100vh",
        padding: "24px 16px",
        background: "#0f0e17",
        color: "white",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        position: "fixed",
        top: 0, left: 0, bottom: 0,
        boxShadow: "2px 0 20px rgba(0,0,0,0.4)"
      }}>
        {/* user */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
          {user?.photo && (
            <img src={user.photo} alt=""
              style={{ width: 38, height: 38, borderRadius: "50%", border: "2px solid #6366f1" }} />
          )}
          <div>
            <p style={{ margin: 0, fontWeight: 700, fontSize: 13 }}>{user?.name}</p>
            <p style={{ margin: 0, fontSize: 10, color: "#a5b4fc" }}>{user?.email}</p>
          </div>
        </div>

        {/* apartment switcher */}
        <div
          style={{
            ...base,
            background: "#1a1a2e",
            border: "1px solid #6366f1",
            marginBottom: 16,
            padding: "8px 12px"
          }}
          onClick={() => setShowApts(s => !s)}
        >
          <p style={{ margin: 0, fontSize: 10, color: "#a5b4fc" }}>ACTIVE APARTMENT</p>
          <p style={{ margin: 0, fontWeight: 700, fontSize: 13 }}>
            🏠 {apartment?.name}
            <span style={{ float: "right", color: "#a5b4fc" }}>{showApts ? "▲" : "▼"}</span>
          </p>
        </div>

        {showApts && apartments.map(a => (
          <div
            key={a.id}
            style={{
              ...base,
              background: a.id === apartment?.id ? "#1e1b4b" : "rgba(255,255,255,0.04)",
              borderLeft: a.id === apartment?.id ? "3px solid #6366f1" : "3px solid transparent",
              fontSize: 13,
              marginBottom: 4
            }}
            onClick={() => { switchApartment(a.id); setShowApts(false); }}
          >
            {a.name}
            <span style={{ fontSize: 10, color: "#888", marginLeft: 6 }}>
              {a.members?.length || 0}👥
            </span>
          </div>
        ))}

        <div style={{ height: 1, background: "rgba(255,255,255,0.08)", margin: "8px 0" }} />

        {/* nav */}
        {NAV.map(({ label, key }) => (
          <div
            key={key}
            style={{
              ...base,
              background: currentPage === key
                ? "rgba(99,102,241,0.3)"
                : "rgba(255,255,255,0.06)",
              borderLeft: currentPage === key
                ? "3px solid #6366f1"
                : "3px solid transparent",
              color: currentPage === key ? "#a5b4fc" : "white"
            }}
            onClick={() => setPage(key)}
            onMouseEnter={e => {
              if (currentPage !== key)
                e.currentTarget.style.background = "rgba(255,255,255,0.12)";
            }}
            onMouseLeave={e => {
              if (currentPage !== key)
                e.currentTarget.style.background = "rgba(255,255,255,0.06)";
            }}
          >
            {label}
          </div>
        ))}

        <div style={{ flex: 1 }} />

        <div style={{ height: 1, background: "rgba(255,255,255,0.08)", margin: "8px 0" }} />
        <div
          style={{ ...base, color: "#fca5a5" }}
          onClick={onLogout}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.15)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
        >
          🚪 Sign Out
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ flex: 1, marginLeft: 220, background: "#f8fafc", minHeight: "100vh" }}>
        {children}
      </div>
    </div>
  );
}
