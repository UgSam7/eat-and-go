import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const CardRestaurant = ({ restaurant }) => {
  return (
    <Card className="restaurant-card shadow-sm">
      <Card.Img
        variant="top"
        src={restaurant.image?.url || restaurant.image?.path || "/placeholder.jpg"}
        className="restaurant-img"
        alt={restaurant.name}
      />
      <Card.Body>
        <Card.Title>{restaurant.name}</Card.Title>
         <div className="restaurant-meta mb-2">
          <span className="cuisine-type">{restaurant.cuisineType}</span>
          {" • "}
          <span className="price-range">{restaurant.priceRange}</span>
        </div>
        <Card.Text>
          {restaurant.description || "Nessuna descrizione disponibile."}
        </Card.Text>
        <Link to={`/restaurants/${restaurant._id}`}>
          <Button variant="dark" size="sm">
            Scopri di più
          </Button>
        </Link>
      </Card.Body>
    </Card>
  );
};

export default CardRestaurant;