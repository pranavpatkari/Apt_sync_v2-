import { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider, db } from "../firebase";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";

export default function Login({ setUser, setSession }) {

  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      setUser(user.displayName);

      // session (same style as yours)
      setSession({
        user: user.displayName,
        expiry: Date.now() + 24 * 60 * 60 * 1000
      });

      // 🔥 store in firestore
      const q = query(
        collection(db, "members"),
        where("email", "==", user.email)
      );

      const snap = await getDocs(q);

      if (snap.empty) {
        await addDoc(collection(db, "members"), {
          name: user.displayName,
          email: user.email
        });
      }

    } catch (err) {
      console.error("Login failed:", err);
      alert("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>Login</h2>

      <button onClick={handleGoogleLogin}>
        {loading ? "Logging..." : "Login with Google 🚀"}
      </button>
    </div>
  );
}
