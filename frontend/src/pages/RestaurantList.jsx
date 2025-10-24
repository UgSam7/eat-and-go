import { useEffect, useState } from "react";
import axios from "axios";
import { Spinner, Alert, Container, Row, Col } from "react-bootstrap";
import CardRestaurant from "../components/CardRestaurant";
import { useLocation } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const city = params.get("city");
  const region = params.get("region");

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/restaurants`, {
        params: { region, city },
      });
      setRestaurants(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Errore nel caricamento dei ristoranti.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, [city, region]);

  // === Loader ===
  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="warning" />
        <p className="mt-3 text-muted">Caricamento ristoranti...</p>
      </div>
    );

  // === Error Handling ===
  if (error) return <Alert variant="danger" className="text-center mt-4">{error}</Alert>;

  // === Nessun ristorante ===
  if (!restaurants.length)
    return (
      <Container className="mt-5">
        <Alert variant="info" className="restaurant-list-empty">
          Nessun ristorante trovato {city ? `a ${city}` : region ? `in ${region}` : ""}.
        </Alert>
      </Container>
    );

  // === Lista ristoranti ===
  return (
    <div className="restaurant-list-container">
      <Container>
        <h2 className="restaurant-list-title">
          {city
            ? `Ristoranti a ${city}`
            : region
            ? `Ristoranti in ${region}`
            : "Tutti i ristoranti"}
        </h2>

        <Row className="g-4">
          {restaurants.map((r) => (
            <Col key={r._id} xs={12} sm={6} md={4} lg={3}>
              <div className="restaurant-card-wrapper">
                <CardRestaurant restaurant={r} />
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default RestaurantList;