import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection, addDoc, onSnapshot, query, where
} from "firebase/firestore";

export default function usePayments(apartmentId) {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    if (!apartmentId) return;
    const q = query(
      collection(db, "payments"),
      where("apartmentId", "==", apartmentId)
    );
    const unsub = onSnapshot(q, snap => {
      setPayments(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [apartmentId]);

  const addPayment = async (payment) => {
    await addDoc(collection(db, "payments"), { ...payment, apartmentId });
  };

  return { payments, addPayment };
}
