import { Routes, Route } from "react-router-dom";
import Login from "./Login.jsx";
import Register from "./Register.jsx";

export default function Home() {
  return (
    <div>
      <nav className="flex gap-4 p-4 bg-gray-100">
        <h1>ⒽⓄⓂⒺ ⓅⒶⒼⒺ</h1>
        <h3>Ⓦⓔⓛⓒⓞⓜⓔ ⓣⓞ ⓈⓣⓤⓓⓨⒷⓤⓖ!</h3>
        <h3>Ⓣⓗⓔ ⓟⓛⓐⓒⓔ ⓕⓞⓡ ⓐⓛⓛ ⓨⓞⓤⓡ ⓢⓣⓤⓓⓨ ⓝⓔⓔⓓⓢ!</h3>

        <a href="/login">
          <button className="login-btn">ⓁⓄⒼⒾⓃ</button>
        </a>
        <a href="/register">
          <button className="register-btn">ⓇⒺⒼⒾⓈⓉⒺⓇ</button>
        </a>
      </nav>

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}
