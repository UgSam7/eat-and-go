import { useEffect, useState } from "react";
import { Container, Card, Spinner, Alert, Button } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        setError("Errore nel caricamento del profilo.");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchProfile();
    } else {
      setError("Nessun token trovato. Effettua il login.");
      setLoading(false);
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="warning" />
        <p className="mt-3 text-muted">Caricamento profilo...</p>
      </div>
    );

  if (error)
    return (
      <Alert variant="danger" className="text-center mt-4">
        {error}
      </Alert>
    );

  return (
    <Container className="mt-5" style={{ maxWidth: "600px" }}>
      <Card
        className="shadow-lg p-4 border-0"
        style={{
          background: "linear-gradient(180deg, #fff5e6 0%, #ffd699 100%)",
          borderRadius: "1.2rem",
        }}
      >
        <Card.Body>
          <h2 className="mb-4 text-center" style={{ color: "#ff7b00" }}>
            Il tuo profilo
          </h2>

          <div className="mb-3">
            <strong>Nome:</strong> {user.firstName} {user.lastName}
          </div>
          <div className="mb-3">
            <strong>Email:</strong> {user.email}
          </div>
          <div className="mb-3">
            <strong>Ruolo:</strong>{" "}
            <span
              style={{
                color:
                  user.role === "admin"
                    ? "#b33f00"
                    : user.role === "superadmin"
                    ? "#d60000"
                    : "#444",
                fontWeight: 600,
                textTransform: "capitalize",
              }}
            >
              {user.role}
            </span>
          </div>

          <div className="text-center mt-4">
            <Button
              variant="danger"
              onClick={handleLogout}
              style={{
                background: "linear-gradient(135deg, #ff7b00, #ffb300)",
                border: "none",
              }}
            >
              Esci
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Profile;