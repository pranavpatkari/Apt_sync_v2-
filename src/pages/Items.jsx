import AddItem  from "../components/AddItem";
import ItemCard from "../components/ItemCard";
import { useState } from "react";
import { categories } from "../data/categories";

export default function Items({ items = [], addItem, updateItem, deleteItem, user, members = [] }) {
  const [filterCat, setFilterCat] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  const filtered = items.filter(item => {
    const catOk    = filterCat    === "All" || item.category === filterCat;
    const statusOk = filterStatus === "All" || item.status   === filterStatus;
    return catOk && statusOk;
  });

  return (
    <div style={{ padding: 32 }}>
      <h1 style={{ marginBottom: 24 }}>🛒 Items</h1>

      <AddItem addItem={addItem} user={user?.name || user} />

      {/* filters */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "24px 0 16px" }}>
        {["All", ...categories.map(c => c.name)].map(c => (
          <div
            key={c}
            onClick={() => setFilterCat(c)}
            style={{
              padding: "5px 12px",
              borderRadius: 20,
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 600,
              background: filterCat === c ? "#6366f1" : "#e5e7eb",
              color: filterCat === c ? "white" : "#374151"
            }}
          >{c}</div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {["All", "needed", "locked", "bought"].map(s => (
          <div
            key={s}
            onClick={() => setFilterStatus(s)}
            style={{
              padding: "5px 14px",
              borderRadius: 20,
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 600,
              background: filterStatus === s ? "#0f172a" : "#e5e7eb",
              color: filterStatus === s ? "white" : "#374151"
            }}
          >{s === "All" ? "All Status" : s}</div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p style={{ color: "#888", marginTop: 32, textAlign: "center" }}>
          No items found. Add one above!
        </p>
      )}

      <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
        {filtered.map(item => (
          <ItemCard
            key={item.id}
            item={item}
            updateItem={updateItem}
            deleteItem={deleteItem}
            user={user?.name || user}
            members={members}
            actorEmail={user?.email}
          />
        ))}
      </div>
    </div>
  );
}
