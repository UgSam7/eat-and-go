import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Spinner, Alert, Card, Button } from "react-bootstrap";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const RestaurantDetail = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/api/restaurants/${id}`);
        setRestaurant(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Errore nel caricamento del ristorante.");
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurant();
  }, [id]);

  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="warning" />
        <p className="mt-3 text-muted">Caricamento dettagli...</p>
      </div>
    );

  if (error) return <Alert variant="danger" className="text-center mt-4">{error}</Alert>;

  if (!restaurant)
    return <Alert variant="info" className="text-center mt-4">Ristorante non trovato.</Alert>;

  return (
    <Container className="restaurant-detail-container">
      <Card className="restaurant-detail-card shadow-lg">
        <div className="restaurant-detail-image-wrapper">
          <Card.Img
            src={restaurant.image?.url || restaurant.image?.path || "/placeholder.jpg"}
            alt={restaurant.name}
            className="restaurant-detail-image"
          />
        </div>

        <Card.Body className="restaurant-detail-body">
          <Card.Title className="restaurant-detail-title">{restaurant.name}</Card.Title>
          <Card.Text className="restaurant-detail-description">
            {restaurant.description || "Nessuna descrizione disponibile."}
          </Card.Text>

          <div className="restaurant-detail-info">
            <p><strong>Indirizzo:</strong> {restaurant.address}</p>
            <p><strong>Città:</strong> {restaurant.city}</p>
            <p><strong>Regione:</strong> {restaurant.region}</p>
            {restaurant.priceRange && <p><strong>Prezzo medio:</strong> {restaurant.priceRange}</p>}
            {restaurant.cuisineType && <p><strong>Tipo di cucina:</strong> {restaurant.cuisineType}</p>}
            {restaurant.website && (
              <p>🌐 <a href={restaurant.website} target="_blank" rel="noopener noreferrer">Visita il sito</a></p>
            )}
          </div>

          <div className="mt-4">
            <Link to="/restaurants">
              <Button variant="dark">← Torna ai ristoranti</Button>
            </Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default RestaurantDetail;