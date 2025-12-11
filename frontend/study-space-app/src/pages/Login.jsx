import React, {useState} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/home";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await login(email, password);
            navigate(from, { replace: true });
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        }
    };

  return (
    <div className="study-card" style={{ maxWidth: 520, margin: "2rem auto" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <h2 className="page-title">Sign in</h2>
        <span className="muted">StudyBug</span>
      </div>

      {error && <div className="empty">{error}</div>}

      <form onSubmit={handleSubmit} className="form" style={{ marginTop: 12 }}>
        <input required value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" type="email" />
        <input required value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" />
        <button className="btn">Login</button>
      </form>
    </div>
  );
}
