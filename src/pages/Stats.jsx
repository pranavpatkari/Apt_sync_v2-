import ExpenseChart from "../components/ExpenseChart";
import { categories } from "../data/categories";

export default function Stats({ items = [], members = [] }) {
  const bought = items.filter(i => i.status === "bought");
  const total  = bought.reduce((s, i) => s + (i.cost || 0), 0);

  // per category breakdown
  const byCat = categories.map(cat => ({
    ...cat,
    count: bought.filter(i => i.category === cat.name).length,
    spent: bought.filter(i => i.category === cat.name)
                 .reduce((s, i) => s + (i.cost || 0), 0)
  })).filter(c => c.count > 0);

  return (
    <div style={{ padding: 32 }}>
      <h1 style={{ marginBottom: 8 }}>📈 Stats</h1>
      <p style={{ color: "#888", marginBottom: 28 }}>
        Total spent: <strong style={{ color: "#0f172a", fontSize: 20 }}>₹{total}</strong>
        &nbsp;&nbsp;·&nbsp;&nbsp;
        Items bought: <strong>{bought.length}</strong>
      </p>

      <h2 style={{ fontSize: 16, marginBottom: 12 }}>Spending by Member</h2>
      <ExpenseChart items={items} members={members} />

      {byCat.length > 0 && (
        <>
          <h2 style={{ fontSize: 16, margin: "32px 0 12px" }}>By Category</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            {byCat.map(cat => (
              <div key={cat.name} style={{
                background: cat.bg,
                border: `1px solid ${cat.color}`,
                borderRadius: 12,
                padding: "14px 20px",
                minWidth: 140,
                boxShadow: cat.glow
              }}>
                <p style={{ margin: 0, fontSize: 20 }}>{cat.emoji}</p>
                <p style={{ margin: "4px 0 0", fontSize: 13, color: cat.color, fontWeight: 700 }}>
                  {cat.name}
                </p>
                <p style={{ margin: 0, fontSize: 11, color: "#888" }}>
                  {cat.count} items · ₹{cat.spent}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
