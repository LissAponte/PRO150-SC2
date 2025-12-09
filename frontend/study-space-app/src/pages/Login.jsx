import { useState } from "react";
import { api } from "../api/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", { email, password });

      // Save token
      localStorage.setItem("token", res.data.token);

      alert("Login successful!");
    } catch (err) {
      setError("Invalid email or password");
    }
  }

  return (
    <form onSubmit={handleLogin} className="max-w-sm mx-auto mt-16 flex flex-col gap-4">
      
      <h2 className="text-2xl font-bold">Ⓛⓞⓖⓘⓝ</h2>

      {error && <p className="text-red-500">{error}</p>}

      <input
        type="email"
        placeholder="Email"
        className="border p-2 rounded"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="border p-2 rounded"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="bg-blue-500 text-white p-2 rounded">Ⓛⓞⓖⓘⓝ</button>
    </form>
  );
}
