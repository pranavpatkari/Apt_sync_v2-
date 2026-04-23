import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  doc, getDoc, setDoc, updateDoc,
  arrayUnion, collection
} from "firebase/firestore";

export default function useApartment(user) {
  const [apartment, setApartment]   = useState(null);
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");

  // load all apartments this user belongs to
  useEffect(() => {
    if (!user) { setLoading(false); return; }

    const load = async () => {
      setLoading(true);
      try {
        const userSnap = await getDoc(doc(db, "users", user.uid));
        const ids = userSnap.exists() ? (userSnap.data().apartments || []) : [];

        const list = [];
        for (const id of ids) {
          const snap = await getDoc(doc(db, "apartments", id));
          if (snap.exists()) list.push({ id, ...snap.data() });
        }
        setApartments(list);

        // pick active apartment
        const activeId = localStorage.getItem("activeApartment");
        const active = list.find(a => a.id === activeId) || list[0] || null;
        setApartment(active);
        if (active) localStorage.setItem("activeApartment", active.id);
      } catch (e) {
        console.error(e);
        setError("Failed to load apartments");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user]);

  const createApartment = async (name) => {
    setError("");
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const ref  = doc(collection(db, "apartments"));
    const data = {
      name,
      code,
      createdBy: user.uid,
      members: [{
        uid:   user.uid,
        name:  user.name,
        email: user.email,
        photo: user.photo
      }],
      createdAt: Date.now()
    };
    await setDoc(ref, data);
    // link to user doc
    await updateDoc(doc(db, "users", user.uid), {
      apartments: arrayUnion(ref.id)
    });
    const apt = { id: ref.id, ...data };
    setApartments(prev => [...prev, apt]);
    setApartment(apt);
    localStorage.setItem("activeApartment", ref.id);
    return code;
  };

  const joinApartment = async (code) => {
    setError("");
    // search by code field
    const { getDocs, query, where } = await import("firebase/firestore");
    const q    = query(collection(db, "apartments"), where("code", "==", code.toUpperCase()));
    const snap = await getDocs(q);
    if (snap.empty) { setError("Invalid code — apartment not found"); throw new Error("not found"); }

    const aptDoc = snap.docs[0];
    const data   = aptDoc.data();
    const already = data.members.some(m => m.uid === user.uid);

    if (!already) {
      await updateDoc(doc(db, "apartments", aptDoc.id), {
        members: arrayUnion({
          uid:   user.uid,
          name:  user.name,
          email: user.email,
          photo: user.photo
        })
      });
    }
    await updateDoc(doc(db, "users", user.uid), {
      apartments: arrayUnion(aptDoc.id)
    });
    const apt = { id: aptDoc.id, ...data };
    setApartments(prev => {
      const exists = prev.find(a => a.id === aptDoc.id);
      return exists ? prev : [...prev, apt];
    });
    setApartment(apt);
    localStorage.setItem("activeApartment", aptDoc.id);
  };

  const switchApartment = (id) => {
    const apt = apartments.find(a => a.id === id);
    if (apt) { setApartment(apt); localStorage.setItem("activeApartment", id); }
  };

  // re-fetch apartment to get latest members
  const refreshApartment = async () => {
    if (!apartment) return;
    const snap = await getDoc(doc(db, "apartments", apartment.id));
    if (snap.exists()) setApartment({ id: apartment.id, ...snap.data() });
  };

  return {
    apartment, apartments, loading, error,
    createApartment, joinApartment, switchApartment, refreshApartment
  };
}
