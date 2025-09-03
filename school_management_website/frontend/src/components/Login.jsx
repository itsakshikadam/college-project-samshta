// src/components/Login.jsx
import React, { useState, useContext } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./AuthForm.scss";
import loginIcon from "../assets/login-icon.png";

function Login() {
  const { setAuthData } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      
      const res = await axios.post(
        "/api/login",   // ✅ no localhost:4000
        { email, password,role},
        { withCredentials: true }
      );

      setAuthData(res.data.accessToken, res.data.user);
      setMsg("Login successful");
    } catch (err) {
      setMsg("Login failed");
    }
  };

  return (
    <div className="auth-box">
      {/* Top Icon + Heading */}
      <img src={loginIcon} alt="Login Icon" className="auth-icon" />
      <h2>Login Here</h2>
      {/* Login Form */}

    <form onSubmit={handleLogin}>
      {/* Email Input*/}
      <div className="form-group">
        <i className="fas fa-user"></i>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      </div>

      {/* Password Input */}
      <div className="form-group">
          <i className="fas fa-lock"></i>
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      </div>

      <button type="submit">Login</button>
      {msg && <p className="form-msg">{msg}</p>}
    </form>
    </div>
  );
}

export default Login;
