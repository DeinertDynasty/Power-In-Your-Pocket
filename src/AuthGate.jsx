import React, { useEffect, useState } from "react";
import { getCurrentUser, listUsers, login } from "./Accounts";

/**
 * Username + Password login (10 users).
 * NOTE: Client-side only—add server auth in production.
 */
export default function AuthGate({ children }) {
  const [user, setUser] = useState(getCurrentUser());
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  if (user) return children;

  return (
    <div style={{
      maxWidth: 460, margin: "14vh auto", padding: 24, borderRadius: 12,
      background: "#fff", boxShadow: "0 10px 30px #0001", textAlign: "left"
    }}>
      <h2 style={{ marginTop: 0 }}>Sign in</h2>
      <p style={{ marginTop: 4, color: "#555" }}>Use one of the issued trainee accounts.</p>

      <label className="category-label">Username</label>
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="e.g., trainee01"
        style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #bbb", marginBottom: 10, fontSize: 16 }}
      />

      <label className="category-label">Password</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #bbb", marginBottom: 10, fontSize: 16 }}
      />

      <button
        className="button"
        onClick={() => {
          const u = login(username.trim(), password);
          if (u) {
            setUser(u);
            setError("");
          } else {
            setError("Invalid credentials");
          }
        }}
      >
        Enter
      </button>

      {error && <div style={{ color: "#e33", marginTop: 10 }}>{error}</div>}

      <div style={{ marginTop: 16, fontSize: 12, color: "#666" }}>
        Allowed users:&nbsp;
        {listUsers().map(u => u.username).join(", ")}
      </div>
      <div style={{ marginTop: 8, fontSize: 12, color: "#888" }}>
        (For production, move auth to the server.)
      </div>
    </div>
  );
}
