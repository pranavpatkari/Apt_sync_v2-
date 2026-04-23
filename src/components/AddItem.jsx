import { useState, useEffect } from "react";
import { categories } from "../data/categories";
import "../styles/additem.css";

export default function AddItem({ addItem, user }) {
  const [text, setText]       = useState("");
  const [cost, setCost]       = useState("");
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(categories[0]);

  // safety reset
  useEffect(() => {
    if (!loading) return;
    const t = setTimeout(() => setLoading(false), 5000);
    return () => clearTimeout(t);
  }, [loading]);

  const reset = () => { setText(""); setCost(""); };

  const handleAdd = async () => {
    if (loading) return;
    if (!text.trim()) return alert("Enter item name");
    setLoading(true);
    try {
      await addItem({
        name: text.trim(),
        cost: Number(cost) || 0,
        category: selected.name,
        status: "needed",
        addedBy: user,
        lockedBy: null,
        boughtBy: null,
        createdAt: Date.now()
      });
      reset();
    } catch (err) {
      console.error(err);
      alert("Failed to add item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-card-box">
      <h3>➕ Add Item</h3>

      {/* category picker */}
      <div className="cat-grid">
        {categories.map(cat => (
          <div
            key={cat.name}
            className={`cat-chip ${selected.name === cat.name ? "active" : ""}`}
            style={selected.name === cat.name ? {
              background: cat.bg,
              borderColor: cat.color,
              color: cat.color,
              boxShadow: cat.glow
            } : {}}
            onClick={() => setSelected(cat)}
          >
            {cat.emoji} {cat.name}
          </div>
        ))}
      </div>

      <input
        placeholder="Item name (e.g. Amul Butter)"
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyDown={e => e.key === "Enter" && handleAdd()}
      />

      <input
        placeholder="₹ Cost (optional)"
        value={cost}
        onChange={e => setCost(e.target.value)}
        onKeyDown={e => e.key === "Enter" && handleAdd()}
      />

      <div className="add-row">
        <button
          className="add-btn primary"
          onClick={handleAdd}
          disabled={loading}
        >
          {loading ? "Adding..." : `Add to ${selected.emoji} ${selected.name}`}
        </button>
        <button className="add-btn secondary" onClick={reset} disabled={loading}>
          Clear
        </button>
      </div>
    </div>
  );
}
