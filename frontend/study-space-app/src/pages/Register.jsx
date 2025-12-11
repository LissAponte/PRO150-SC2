import React, { useState} from "react";
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
    <div className="max-w-md mx-auto mt-20 p-6 border rounded">
      <h2 className="text-2xl mb-4">Register</h2>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input required placeholder="Full name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="border p-2 rounded" />
        <input required placeholder="Email" value={form.email} type="email" onChange={e => setForm({...form, email: e.target.value})} className="border p-2 rounded" />
        <input required placeholder="Password" value={form.password} type="password" onChange={e => setForm({...form, password: e.target.value})} className="border p-2 rounded" />
        <button className="bg-green-600 text-white p-2 rounded">Create account</button>
      </form>
    </div>
  );
}