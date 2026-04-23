import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection, addDoc, onSnapshot,
  updateDoc, deleteDoc, doc, query, where
} from "firebase/firestore";

export default function useItems(apartmentId) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!apartmentId) return;
    // scope items to this apartment
    const q = query(
      collection(db, "items"),
      where("apartmentId", "==", apartmentId)
    );
    const unsub = onSnapshot(q, snapshot => {
      setItems(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [apartmentId]);

  const addItem = async (item) => {
    await addDoc(collection(db, "items"), { ...item, apartmentId });
  };

  const updateItem = async (id, data) => {
    await updateDoc(doc(db, "items", id), data);
  };

  const deleteItem = async (id) => {
    await deleteDoc(doc(db, "items", id));
  };

  return { items, addItem, updateItem, deleteItem };
}
