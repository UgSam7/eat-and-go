import { useState } from 'react';
import { Form, Button, Container, Card, Spinner, Alert, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const AddRestaurant = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [region, setRegion] = useState('');
  const [website, setWebsite] = useState('');
  const [priceRange, setPriceRange] = useState('€€');
  const [cuisineType, setCuisineType] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('token');
  const user = token ? jwtDecode(token) : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!user) {
      setError('Devi essere autenticato per aggiungere un ristorante.');
      return;
    }

    if (!name || !address || !city || !region) {
      setError('Compila almeno nome, indirizzo, città e regione.');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('address', address);
      formData.append('city', city);
      formData.append('region', region);
      formData.append('website', website);
      formData.append('priceRange', priceRange);
      formData.append('cuisineType', cuisineType);
      if (image) formData.append('image', image);

      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/restaurants`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage(res.data.message || 'Ristorante inviato per approvazione!');
      setName('');
      setDescription('');
      setAddress('');
      setCity('');
      setRegion('');
      setWebsite('');
      setPriceRange('€€');
      setCuisineType('');
      setImage(null);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Errore durante l'invio.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: '700px' }}>
      <Card className="p-4 shadow-sm">
        <h3 className="mb-4 text-center">🍽️ Aggiungi un nuovo ristorante</h3>

        {message && <Alert variant="success">{message}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Nome *</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome del ristorante"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Descrizione</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Breve descrizione"
            />
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Indirizzo *</Form.Label>
                <Form.Control
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Via, civico..."
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Città *</Form.Label>
                <Form.Control
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Città"
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Regione / Provincia *</Form.Label>
                <Form.Control
                  type="text"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  placeholder="Regione"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Sito web</Form.Label>
                <Form.Control
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://..."
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>💶 Fascia di prezzo media (menu completo)</Form.Label>
                <Form.Select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                >
                  <option value="10-15">€10 - €15</option>
                  <option value="15-20">€15 - €20</option>
                  <option value="20-30">€20 - €30</option>
                  <option value="30+">€30 o più</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>🍝 Tipo di cucina</Form.Label>
                <Form.Control
                  type="text"
                  value={cuisineType}
                  onChange={(e) => setCuisineType(e.target.value)}
                  placeholder="Es. Italiana, Giapponese, Pizzeria..."
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-4">
            <Form.Label>📸 Immagine</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />

          </Form.Group>

          <div className="text-center">
            <Button variant="warning" type="submit" disabled={loading} className="fw-semibold">
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Caricamento...
                </>
              ) : (
                'Invia per approvazione'
              )}
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default AddRestaurant;