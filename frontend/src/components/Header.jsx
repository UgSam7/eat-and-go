import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/eatandgo.png";
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
      <Container fluid className="navbar-container">
        <Navbar.Brand as={Link} to="/" className="logo-link">
          <img
            src={logo}
            alt="Eat&Go Logo"
            className="site-logo"
          />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          <Nav className="me-auto">

            {user?.role === "superadmin" && (
              <Nav.Link as={Link} to="/admin/restaurants" className="nav-item-custom">
                🧑‍💼 Admin
              </Nav.Link>
            )}
          </Nav>

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