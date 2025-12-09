import { useState } from "react";
import { api } from "../api/api";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  async function handleRegister(e) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await api.post("/auth/register", { name, email, password });
      alert("Account created! You can now log in.");
    } catch (err) {
      setError("Registration failed");
    }
  }

  return (
    <form onSubmit={handleRegister} className="max-w-sm mx-auto mt-16 flex flex-col gap-4">

      <h2 className="text-2xl font-bold">Ⓡⓔⓖⓘⓢⓣⓔⓡ</h2>

      {error && <p className="text-red-500">{error}</p>}

      <input
        type="text"
        placeholder="Name"
        className="border p-2 rounded"
        onChange={(e) => setName(e.target.value)}
      />

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

      <input
        type="password"
        placeholder="Confirm Password"
        className="border p-2 rounded"
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <button className="bg-green-500 text-white p-2 rounded">
        Create Account
      </button>
    </form>
  );
}
