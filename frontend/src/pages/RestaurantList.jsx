import { useEffect, useState } from 'react';
import axios from 'axios';
import CardRestaurant from '../components/CardRestaurant.jsx';
import { Row, Col, Spinner } from 'react-bootstrap';

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await axios.get('http://localhost:4001/restaurants');
        setRestaurants(res.data);
      } catch (error) {
        console.error('Errore nel caricamento ristoranti', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  if (loading) return <Spinner animation="border" />;

  return (
    <Row>
      {restaurants.map((r) => (
        <Col md={6} lg={4} key={r._id}>
          <CardRestaurant restaurant={r} />
        </Col>
      ))}
    </Row>
  );
};

export default RestaurantList;
