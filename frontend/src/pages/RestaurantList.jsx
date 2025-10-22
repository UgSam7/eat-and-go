import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Spinner, Alert } from "react-bootstrap";
import CardRestaurant from "../components/CardRestaurant";

const API_URL = import.meta.env.VITE_API_URL;

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRestaurants = async () => {
    try {
      const res = await axios.get(`${API_URL}/restaurants`);
      setRestaurants(res.data || []);
    } catch (err) {
      console.error("Errore nel caricamento ristoranti", err);
      setError("Errore nel caricamento dei ristoranti. Riprova più tardi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!restaurants.length) {
    return (
      <Container className="mt-4">
        <Alert variant="info">Nessun ristorante disponibile al momento.</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-4 text-center">🍽️ Ristoranti disponibili</h2>
      <Row>
        {restaurants.map((restaurant) => (
          <Col key={restaurant._id} xs={12} md={6} lg={4}>
            <CardRestaurant restaurant={restaurant} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default RestaurantList;