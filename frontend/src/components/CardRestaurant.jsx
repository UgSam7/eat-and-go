import { Card, Button } from "react-bootstrap";

const CardRestaurant = ({ restaurant }) => {
  const image =
    restaurant.image?.url ||
    restaurant.image?.path ||
    "/placeholder.jpg";

  return (
    <Card className="restaurant-card-wrapper shadow-lg">
      <Card.Img
        variant="top"
        classname="restaurant-img"
        src={restaurant.image?.url || "/placeholder.jpg"}
        alt={restaurant.name}
      />
      <Card.Body className="restaurant-card-body">
        <Card.Title className="restaurant-card-title">
          {restaurant.name}
        </Card.Title>
        <Card.Text className="restaurant-card-description">
          {restaurant.description}
        </Card.Text>
        <Card.Text className="text-muted small mb-2">
          📍 {restaurant.address}
        </Card.Text>
        <Button variant="dark" className="restaurant-btn">
          Scopri di più
        </Button>
      </Card.Body>
    </Card>
  );
};

export default CardRestaurant;