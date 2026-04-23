import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";

export default function useMembers() {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    try {
      const unsub = onSnapshot(collection(db, "members"), snapshot => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setMembers(data);
      });

      return () => unsub();
    } catch {
      setMembers([]);
    }
  }, []);

  return members;
}
