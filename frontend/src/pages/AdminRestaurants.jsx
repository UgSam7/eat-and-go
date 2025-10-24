import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Card, Spinner, Alert, Container, Row, Col } from 'react-bootstrap';

const API_URL = import.meta.env.VITE_API_URL;

const AdminRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchPending = async () => {
  try {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Devi essere autenticato come admin.');
      setLoading(false);
      return;
    }
    const res = await axios.get(`${import.meta.env.VITE_API_URL}restaurants/pending`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setRestaurants(res.data || []);
  } catch (err) {
    console.error('Errore fetchPending:', err);
    setError(err.response?.data?.message || 'Errore durante il caricamento.');
  } finally {
    setLoading(false);
  }
};

  const handleApprove = async (id) => {
    if (!window.confirm('Vuoi approvare questo ristorante?')) return;

    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/restaurants/approve/${id}`, {}, {
        headers: getAuthHeader(),
      });
      setRestaurants((prev) => prev.filter((r) => r._id !== id));
      alert('Ristorante approvato con successo!');
    } catch (err) {
      alert(err.response?.data?.message || 'Errore durante l’approvazione');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Vuoi davvero eliminare questo ristorante?')) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/restaurants/${id}`, {
        headers: getAuthHeader(),
      });
      setRestaurants((prev) => prev.filter((r) => r._id !== id));
      alert('Ristorante eliminato.');
    } catch (err) {
      alert(err.response?.data?.message || 'Errore durante l’eliminazione.');
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );

  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!restaurants.length)
    return <Alert variant="info">Nessun ristorante in attesa di approvazione.</Alert>;

  return (
    <Container className="mt-4">
      <h2 className="mb-4 text-center">Ristoranti in attesa di approvazione</h2>
      <Row>
        {restaurants.map((r) => (
          <Col key={r._id} md={4} className="mb-3">
            <Card className="shadow-sm">
              {r.image?.path && (
                <Card.Img
                  variant="top"
                  src={r.image.path}
                  alt={r.name}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
              )}
              <Card.Body>
                <Card.Title>{r.name}</Card.Title>
                <Card.Text>{r.description}</Card.Text>
                <Card.Text>
                  <small className="text-muted">{r.address}</small>
                </Card.Text>
                <div className="d-flex justify-content-between">
                  <Button variant="success" size="sm" onClick={() => handleApprove(r._id)}>
                    Approva
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(r._id)}>
                    Elimina
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default AdminRestaurants;