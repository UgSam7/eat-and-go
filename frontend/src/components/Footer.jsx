import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer>
      <Container>
        <p>
          © {new Date().getFullYear()} Eat & Go — Tutti i diritti riservati 🍽️
        </p>
        <div style={{ marginTop: "0.5rem" }}>
          <Link to="/privacy" className="text-white mx-2 text-decoration-underline">
            Privacy Policy
          </Link>
          <Link to="/terms" className="text-white mx-2 text-decoration-underline">
            Termini e Condizioni
          </Link>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;