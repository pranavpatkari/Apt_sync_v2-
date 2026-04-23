import { categories } from "../data/categories";
import useNotify from "../hooks/useNotify";
import "../styles/card.css";

export default function ItemCard({
  item, updateItem, deleteItem, user, members, actorEmail
}) {
  const cat = categories.find(c => c.name === item.category) || categories[7];
  const { notify } = useNotify();

  const reserve = async () => {
    if (item.status !== "needed") return;
    try {
      await updateItem(item.id, { status: "locked", lockedBy: user });
      await notify({
        members,
        actorEmail,
        message: `🔒 ${user} reserved "${item.name}" in your apartment list.`
      });
    } catch (err) { console.error("Reserve failed:", err); }
  };

  const buy = async () => {
    if (item.lockedBy !== user) return;
    try {
      await updateItem(item.id, { status: "bought", boughtBy: user });
      await notify({
        members,
        actorEmail,
        message: `✅ ${user} bought "${item.name}" (₹${item.cost || 0}).`
      });
    } catch (err) { console.error("Buy failed:", err); }
  };

  // 🔥 FIXED REMOVE (ADDED EMAIL)
  const remove = async () => {
    try {
      await deleteItem(item.id);

      await notify({
        members,
        actorEmail,
        message: `❌ ${user} removed "${item.name}" from the list.`
      });

    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="item-card">
      <div className="card-band" style={{ background: cat.color }} />
      <div className="card-body">
        <div className="card-badge" style={{
          color: cat.color, borderColor: cat.color,
          background: cat.bg, boxShadow: cat.glow
        }}>
          {cat.emoji} {cat.name}
        </div>

        <p className="card-name">{item.name}</p>
        <p className="card-price">₹{item.cost || 0}</p>
        <p className="card-meta">Added by {item.addedBy}</p>

        {item.status === "needed" && (
          <button className="card-btn reserve" onClick={reserve}>
            🛒 Reserve
          </button>
        )}

        {item.status === "locked" && (
          <>
            <div className="card-status">
              🔒 Reserved by <strong>{item.lockedBy}</strong>
            </div>
            {item.lockedBy === user && (
              <button className="card-btn buy" onClick={buy}>
                ✅ Mark Bought
              </button>
            )}
          </>
        )}

        {item.status === "bought" && (
          <div className="card-status" style={{ color: "#22c55e" }}>
            ✅ Bought by <strong>{item.boughtBy}</strong>
          </div>
        )}

        <button className="card-btn remove" onClick={remove}>
          🗑 Remove
        </button>
      </div>
    </div>
  );
}
