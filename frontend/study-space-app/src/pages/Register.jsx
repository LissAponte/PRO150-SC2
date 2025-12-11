import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await register(form);
            navigate("/home");
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
        }
    };

 return (
    <div className="study-card" style={{ maxWidth: 520, margin: "2rem auto" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <h2 className="page-title">Create account</h2>
        <span className="muted">StudyBug</span>
      </div>

      {error && <div className="empty">{error}</div>}

      <form onSubmit={handleSubmit} className="form" style={{ marginTop: 12 }}>
        <input required placeholder="Full name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
        <input required placeholder="Email" value={form.email} type="email" onChange={e => setForm({...form, email: e.target.value})} />
        <input required placeholder="Password" value={form.password} type="password" onChange={e => setForm({...form, password: e.target.value})} />
        <button className="btn">Create account</button>
      </form>
    </div>
  );
}
