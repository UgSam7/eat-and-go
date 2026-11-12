import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (loading)
    return <div className="text-center mt-5">Caricamento profilo...</div>;

  if (!user)
    return (
      <div className="alert alert-warning mt-5 text-center">
        Devi effettuare il login per vedere il profilo.
      </div>
    );

  return (
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
      <div className="card shadow-sm p-4">
        <h3 className="text-center mb-4">Profilo Utente</h3>

        <p><strong>Nome:</strong> {user.firstName}</p>
        <p><strong>Cognome:</strong> {user.lastName}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Ruolo:</strong> {user.role}</p>

        <div className="text-center mt-4">
          <button className="btn btn-danger" onClick={handleLogout}>
            Esci
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
