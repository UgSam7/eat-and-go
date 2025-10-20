import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';

const Header = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="md" className="mb-4">
      <Container>
        {/* Nome sito a sinistra */}
        <Navbar.Brand as={Link} to="/">
          EatAndGo
        </Navbar.Brand>

        {/* Dropdown utente a destra */}
        <Nav className="ms-auto">
          <NavDropdown
            title={<FaUserCircle size={28} />}
            id="user-dropdown"
            align="end"
          >
            <NavDropdown.Item as={Link} to="/login">
              Login
            </NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/register">
              Registrati
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Header;
