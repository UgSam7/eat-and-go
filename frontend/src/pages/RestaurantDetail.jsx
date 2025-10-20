import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Card, Spinner } from 'react-bootstrap';

const RestaurantDetail = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const res = await axios.get(`http://localhost:4001/api/ristoranti/${id}`);
        setRestaurant(res.data);
      } catch (error) {
        console.error('Errore nel caricamento dettagli ristorante', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [id]);

  if (loading) return <Spinner animation="border" />;
  if (!restaurant) return <p>Ristorante non trovato.</p>;

  return (
    <Container className="mt-4">
      <Card>
        <Card.Img variant="top" src={restaurant.image || '/default-restaurant.jpg'} />
        <Card.Body>
          <Card.Title>{restaurant.name}</Card.Title>
          <Card.Text>
            <strong>Regione:</strong> {restaurant.region}<br />
            <strong>Città:</strong> {restaurant.city}<br />
            <strong>Indirizzo:</strong> {restaurant.address}<br />
            <strong>Descrizione:</strong> {restaurant.description}
          </Card.Text>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default RestaurantDetail;
