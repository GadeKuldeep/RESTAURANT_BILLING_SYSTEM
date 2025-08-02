import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "./Login.css"

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-container">
      <div className="top-images">
        <img className="image1" src="/images/image1.svg" alt="Descriptive alt text" />
        <div className="main-images">
          <img className="mainImage" src="/images/mainImage.svg" alt="Descriptive alt text" />
          <img className="mainImage2" src="/images/main2.svg" alt="Descriptive alt text" />
        </div>
        <img className="image2" src="/images/image2.svg" alt="Descriptive alt text" />
      </div>
      <div className="admin-form">
        <form onSubmit={handleLogin} className="login-form">
          <div className="input-block">
            Email:-
            <input
              type="email"
              placeholder="Admin Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="login-input1"
            /><br />
          </div>
          <div className="pass-block">
            Password:-
            <input
              type="password"
              placeholder="Admin Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="login-input2"
            />
          </div>
          <button type="submit" className="login-button">Login</button>
          {error && <p className="login-error">{error}</p>}
        </form>
      </div>
      <div className="bottom-images">
        <img className="image3" src="/images/image3.svg" alt="Descriptive alt text" />
        <img className="image4" src="/images/image4.svg" alt="Descriptive alt text" />
      </div>
    </div>
  );
};

export default Login;
