import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/global.css";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Navbar expand="lg" className="custom-navbar shadow-sm py-3" sticky="top">
      <Container>
        {/* Logo Testuale Animato */}
        <Navbar.Brand as={Link} to="/" className="logo-text">
          <span className="logo-eat">Eat</span>
          <span className="logo-and">&</span>
          <span className="logo-go">Go</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          {/* Sezione navigazione */}
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/restaurants" className="nav-item-custom">
              🍝 Ristoranti
            </Nav.Link>

            {user?.role === "superadmin" && (
              <Nav.Link as={Link} to="/admin/restaurants" className="nav-item-custom">
                🧑‍💼 Admin
              </Nav.Link>
            )}
          </Nav>

          {/* Sezione utente */}
          <Nav>
            {user ? (
              <NavDropdown
                title={
                  <span className="user-icon-wrapper">
                    <FaUserCircle size={26} className="user-icon" />
                    <span className="username">{user.firstName}</span>
                  </span>
                }
                align="end"
                className="user-dropdown"
              >
                <NavDropdown.Item as={Link} to="/profile">
                  👤 Profilo
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout} className="logout-item">
                  🚪 Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="nav-item-custom">
                  🔐 Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register" className="nav-item-custom">
                  ✍️ Registrati
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;