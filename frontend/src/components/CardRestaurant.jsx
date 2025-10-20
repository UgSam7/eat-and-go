import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const CardRestaurant = ({ restaurant }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/restaurants/${restaurant._id}`);
  };

  return (
    <Card onClick={handleClick} className="mb-3 shadow-sm" style={{ cursor: 'pointer' }}>
      <Card.Img variant="top" src={restaurant.image.url} alt={restaurant.name} />
      <Card.Body>
        <Card.Title>{restaurant.name}</Card.Title>
        <Card.Text>
          {restaurant.city}, {restaurant.region}
        </Card.Text>
        <Button variant="primary" onClick={handleClick}>Scopri di più</Button>
      </Card.Body>
    </Card>
  );
};

export default CardRestaurant;


