import { useEffect, useState } from "react";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { auth, provider, db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default function useAuth() {
  const [user, setUser]       = useState(undefined); // undefined = loading
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // upsert user doc in Firestore
        const ref = doc(db, "users", firebaseUser.uid);
        const snap = await getDoc(ref);
        if (!snap.exists()) {
          await setDoc(ref, {
            uid:   firebaseUser.uid,
            name:  firebaseUser.displayName,
            email: firebaseUser.email,
            photo: firebaseUser.photoURL,
            apartments: [],
            createdAt: Date.now()
          });
        }
        setUser({
          uid:   firebaseUser.uid,
          name:  firebaseUser.displayName,
          email: firebaseUser.email,
          photo: firebaseUser.photoURL
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const login = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem("activeApartment");
  };

  return { user, loading, login, logout };
}
