import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../styles/Home.css";

const Home = () => {
  return (
    <div className="home-wrapper">
      <div className="hero-section text-center text-light d-flex flex-column justify-content-center align-items-center">
        <Container>
          <h1 className="display-3 fw-bold mb-3 title">
            Benvenuto su <span className="highlight">Eat & Go</span> 🍽️
          </h1>
          <p className="lead mb-4 subtitle">
            Scopri i migliori ristoranti in cui fermarti per un pranzo di lavoro!
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Button
              as={Link}
              to="/restaurants"
              variant="warning"
              size="lg"
              className="fw-semibold shadow explore-btn"
            >
              🍕 Esplora Ristoranti
            </Button>
            <Button
              as={Link}
              to="/add-restaurant"
              variant="outline-light"
              size="lg"
              className="fw-semibold add-btn"
            >
              ➕ Aggiungi il tuo
            </Button>
          </div>
        </Container>
      </div>

      {/* Info Section */}
      <Container className="info-section py-5 text-center">
        <Row className="justify-content-center">
          <Col md={8}>
            <h2 className="fw-bold mb-3">Mangiare bene è un'arte</h2>
            <p className="text-muted fs-5">
              Eat & Go ti permette di esplorare i migliori ristoranti della tua zona, 
              per una pausa pranzo indimenticabile. Che tu sia in città per lavoro o in viaggio,
              mangiare bene, ma spendendo il giusto, non è mai stato così facile!
            </p>
          </Col>
        </Row>
      </Container>

      {/* Features Section */}
      <Container className="features-section pb-5">
        <Row className="gy-4">
          <Col md={4}>
            <Card className="feature-card text-center p-3 shadow-sm h-100">
              <Card.Body>
                <Card.Title className="fw-bold">🌍 Esplora</Card.Title>
                <Card.Text>
                  Scopri ristoranti in base alla città o alla regione.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="feature-card text-center p-3 shadow-sm h-100">
              <Card.Body>
                <Card.Title className="fw-bold">⭐ Approva</Card.Title>
                <Card.Text>
                  I nostri admin verificano ogni ristorante per garantire qualità e autenticità.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="feature-card text-center p-3 shadow-sm h-100">
              <Card.Body>
                <Card.Title className="fw-bold">🍷 Condividi</Card.Title>
                <Card.Text>
                  Aggiungi il tuo ristorante e fallo conoscere a tutta la community.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Home;