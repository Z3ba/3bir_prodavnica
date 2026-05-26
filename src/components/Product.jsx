import { Badge, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Rating from './Rating';

const Product = ({ product }) => {
    return (
        <Card className="product-card h-100">
            <Link className="product-image-wrap" to={`/product/${product._id}`}>
                <Card.Img src={product.image} alt={product.name} />
                <Badge className="product-badge">{product.category}</Badge>
            </Link>
            <Card.Body>
                <Card.Title as="h3">
                    <Link to={`/product/${product._id}`}>{product.name}</Link>
                </Card.Title>
                <Card.Text>{product.description}</Card.Text>
                <div className="beer-meta">
                    <span>{product.style}</span>
                    <span>{product.strength}</span>
                    <span>{product.taste}</span>
                </div>
                <Rating value={product.rating} text={`${product.numReviews} recenzija`} />
                <div className="product-footer">
                    <strong>{product.price.toFixed(2)} RSD</strong>
                    <span>{product.countInStock > 0 ? `${product.countInStock} na stanju` : 'Nema na stanju'}</span>
                </div>
            </Card.Body>
        </Card>
    );
};

export default Product;
