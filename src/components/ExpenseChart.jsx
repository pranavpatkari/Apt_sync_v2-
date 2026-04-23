import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function ExpenseChart({ items, members }) {

  const dataMap = {};

  // 🔥 FIXED: use m.name
  members.forEach(m => {
    dataMap[m.name] = 0;
  });

  items.forEach(item => {
    if (item.status === "bought" && item.cost) {
      dataMap[item.boughtBy] += item.cost;
    }
  });

  const data = Object.keys(dataMap)
    .map(user => ({
      name: user,
      amount: dataMap[user]
    }))
    .sort((a, b) => b.amount - a.amount);

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="amount" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
