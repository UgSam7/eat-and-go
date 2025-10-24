import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenFromUrl = params.get("token");

    if (tokenFromUrl) {
      login(tokenFromUrl);
      navigate("/");
    }
  }, [location.search, login, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        email,
        password,
      });
    

    console.log("Risposta login:", res.data);

    if (res.data.token) {
      login(res.data.token);
      navigate("/");
    } else {
      alert("Errore: token non ricevuto dal server.");
    }
  } catch (error) {
    console.error("Errore nel login:", error);
    alert("Email o password errati.");
  }
};

return (
  <div className="container mt-5" style={{ maxWidth: "400px" }}>
    <h2 className="text-center mb-4">Accedi</h2>

    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <input
          type="email"
          className="form-control"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <input
          type="password"
          className="form-control"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <button type="submit" className="btn btn-primary w-100">
        Login
      </button>
    </form>

    <hr />

    <button
      className="btn btn-danger w-100"
      onClick={() =>
      (window.location.href =
        "http://localhost:4001/api/auth/login-google")
      }
    >
      Login con Google
    </button>
  </div>
);
}

export default Login;