import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const { token, logout } = useAuth();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // ✅ Recupera il token dallo stato o dal localStorage
        const storedToken = token || localStorage.getItem("token");
        if (!storedToken) return;

        // ✅ Effettua la chiamata API con il token corretto
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/auth/me`,
          {
            headers: { Authorization: `Bearer ${storedToken}` },
          }
        );

        setUser(res.data);
      } catch (err) {
        console.error("Errore nel caricamento del profilo:", err);
        setError("Errore durante il caricamento del profilo utente.");
      }
    };

    fetchProfile();
  }, [token]);

  if (error)
    return (
      <div className="alert alert-danger mt-5 text-center">{error}</div>
    );

  if (!user)
    return <div className="text-center mt-5">Caricamento profilo...</div>;

  return (
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
      <div className="card shadow-sm p-4">
        <h3 className="text-center mb-4">Profilo Utente</h3>

        <p><strong>Nome:</strong> {user.firstName}</p>
        <p><strong>Cognome:</strong> {user.lastName}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Ruolo:</strong> {user.role}</p>

        <div className="text-center mt-4">
          <button className="btn btn-danger" onClick={logout}>
            Esci
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;