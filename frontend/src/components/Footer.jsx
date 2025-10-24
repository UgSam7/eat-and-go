import { Container } from "react-bootstrap";

const Footer = () => {
  return (
    <footer>
      <Container>
        <p>© {new Date().getFullYear()} Eat & Go — Tutti i diritti riservati 🍽️</p>
      </Container>
    </footer>
  );
};

export default Footer;