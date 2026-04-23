export default function Header({ user, setUser }) {
  return (
    <div className="header">
      <h1>AptSync 2.0</h1>
      <input
        placeholder="Enter your name"
        value={user}
        onChange={(e) => setUser(e.target.value)}
      />
    </div>
  );
}
