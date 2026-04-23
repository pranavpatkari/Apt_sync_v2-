import { useState } from "react";
import ImageSlider from "../components/ImageSlider";
import "../styles/login.css";

export default function Setup({
  user, login, apartments,
  createApartment, joinApartment, switchApartment, aptError
}) {
  const [step, setStep]       = useState(user ? "choice" : "auth");
  const [aptName, setAptName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [createdCode, setCreatedCode] = useState("");
  const [createdName, setCreatedName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      await login();
      setStep("choice");
    } catch { setError("Login failed. Try again."); }
    finally   { setLoading(false); }
  };

  const handleCreate = async () => {
    if (!aptName.trim()) return setError("Enter apartment name");
    setLoading(true); setError("");
    try {
      const code = await createApartment(aptName.trim());
      setCreatedCode(code);
      setCreatedName(aptName.trim());
      setStep("created");
    } catch { setError("Failed to create. Try again."); }
    finally   { setLoading(false); }
  };

  const handleJoin = async () => {
    if (joinCode.trim().length !== 6) return setError("Code must be 6 characters");
    setLoading(true); setError("");
    try {
      await joinApartment(joinCode.trim());
      // apartment state will update and App re-renders automatically
    } catch (e) { setError(aptError || e.message || "Invalid code"); }
    finally     { setLoading(false); }
  };

  const displayError = error || aptError;

  return (
    <div className="page">
      <ImageSlider />
      <div className="card">
        <h1>🏠 AptSync</h1>

        {/* AUTH */}
        {step === "auth" && (
          <>
            <p style={{ color: "#555", marginBottom: 16 }}>
              Sign in with Google to get started.
            </p>
            <button onClick={handleLogin} disabled={loading} style={{ width: "100%" }}>
              {loading ? "Signing in..." : "Continue with Google 🚀"}
            </button>
          </>
        )}

        {/* CHOICE */}
        {step === "choice" && (
          <>
            <p style={{ marginBottom: 4, fontSize: 13, color: "#555" }}>
              Signed in as
            </p>
            <p style={{ fontWeight: 700, marginBottom: 20 }}>
              ✅ {user?.email}
            </p>

            {/* existing apartments */}
            {apartments.length > 0 && (
              <>
                <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
                  Your apartments:
                </p>
                {apartments.map(a => (
                  <div
                    key={a.id}
                    onClick={() => switchApartment(a.id)}
                    style={{
                      padding: "10px 14px",
                      background: "#f0f0ff",
                      border: "1px solid #6366f1",
                      borderRadius: 8,
                      marginBottom: 8,
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                  >
                    <span style={{ fontWeight: 600 }}>🏠 {a.name}</span>
                    <span style={{
                      fontSize: 11,
                      background: "#6366f1",
                      color: "white",
                      padding: "2px 8px",
                      borderRadius: 20
                    }}>
                      {a.members?.length || 0} members
                    </span>
                  </div>
                ))}
                <hr style={{ margin: "16px 0", borderColor: "#eee" }} />
              </>
            )}

            <button
              style={{ width: "100%", marginBottom: 10, background: "#6366f1" }}
              onClick={() => { setStep("create"); setError(""); }}
            >
              🏗️ Create New Apartment
            </button>
            <button
              style={{ width: "100%", background: "#10b981" }}
              onClick={() => { setStep("join"); setError(""); }}
            >
              🔑 Join with Code
            </button>
          </>
        )}

        {/* CREATE */}
        {step === "create" && (
          <>
            <p style={{ fontSize: 13, color: "#555", marginBottom: 12 }}>
              Give your apartment a name.
            </p>
            <input
              placeholder="e.g. Sunrise Flat"
              value={aptName}
              onChange={e => setAptName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleCreate()}
            />
            <button
              style={{ marginTop: 10, width: "100%" }}
              onClick={handleCreate}
              disabled={loading}
            >
              {loading ? "Creating..." : "Create & Get Code →"}
            </button>
            <button
              style={{ marginTop: 8, width: "100%", background: "#9ca3af" }}
              onClick={() => setStep("choice")}
            >
              ← Back
            </button>
          </>
        )}

        {/* JOIN */}
        {step === "join" && (
          <>
            <p style={{ fontSize: 13, color: "#555", marginBottom: 12 }}>
              Ask your roommate for the 6-character code.
            </p>
            <input
              placeholder="Enter code (e.g. AB12CD)"
              value={joinCode}
              maxLength={6}
              onChange={e => setJoinCode(e.target.value.toUpperCase())}
              onKeyDown={e => e.key === "Enter" && handleJoin()}
              style={{ letterSpacing: 6, fontWeight: 700, fontSize: 20, textAlign: "center" }}
            />
            <button
              style={{ marginTop: 10, width: "100%" }}
              onClick={handleJoin}
              disabled={loading}
            >
              {loading ? "Joining..." : "Join Apartment →"}
            </button>
            <button
              style={{ marginTop: 8, width: "100%", background: "#9ca3af" }}
              onClick={() => setStep("choice")}
            >
              ← Back
            </button>
          </>
        )}

        {/* CREATED — show code */}
        {step === "created" && (
          <>
            <p>✅ <strong>{createdName}</strong> created!</p>
            <p style={{ fontSize: 13, color: "#555", marginTop: 8 }}>
              Share this code with your roommates:
            </p>
            <div style={{
              fontSize: 38,
              fontWeight: 900,
              letterSpacing: 10,
              textAlign: "center",
              background: "#f0f0ff",
              border: "2px dashed #6366f1",
              borderRadius: 12,
              padding: "24px 0",
              margin: "16px 0",
              color: "#6366f1"
            }}>
              {createdCode}
            </div>
            <button
              onClick={() => { navigator.clipboard.writeText(createdCode); alert("Copied!"); }}
              style={{ width: "100%", background: "#9ca3af", marginBottom: 10 }}
            >
              📋 Copy Code
            </button>
            <button
              style={{ width: "100%" }}
              onClick={() => setStep("choice")}
            >
              Enter Dashboard →
            </button>
          </>
        )}

        {displayError && (
          <p style={{ color: "#ef4444", marginTop: 12, fontSize: 13 }}>
            ⚠️ {displayError}
          </p>
        )}
      </div>
    </div>
  );
}
