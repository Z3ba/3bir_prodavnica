import { useState } from 'react';
import { Alert, Badge, Button, Card, Col, Form, Image, ListGroup, Row } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import Rating from '../components/Rating';
import { useCart } from '../context/CartContext';
import products from '../products_list';

const ProductScreen = () => {
    const { id } = useParams();
    const product = products.find((item) => item._id === id);
    const [qty, setQty] = useState(1);
    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState(product?.reviews || []);
    const [addedToCart, setAddedToCart] = useState(false);
    const { addToCart } = useCart();

    const submitCommentHandler = (event) => {
        event.preventDefault();

        if (!comment.trim()) {
            return;
        }

        setComments([
            ...comments,
            {
                name: 'Registrovani korisnik',
                rating,
                comment,
                image: '',
            },
        ]);
        setRating(5);
        setComment('');
    };

    if (!product) {
        return (
            <>
                <Link className="btn btn-outline-primary mb-3" to="/">Nazad na katalog</Link>
                <Card className="p-4">
                    <h2>Pivo nije pronadjeno</h2>
                </Card>
            </>
        );
    }

    return (
        <>
            <Link className="btn btn-outline-primary mb-3" to="/">Nazad na katalog</Link>

            <Row className="g-4">
                <Col md={6}>
                    <Card className="detail-card">
                        <Card.Body className="text-center">
                            <Image src={product.image} alt={product.name} fluid className="detail-image" />
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card className="detail-card">
                        <Card.Body>
                            <Badge className="product-badge-static mb-3">{product.category}</Badge>
                            <h1>{product.name}</h1>
                            <Rating value={product.rating} text={`${product.numReviews} recenzija`} />
                            <p className="mt-3">{product.description}</p>

                            <ListGroup variant="flush" className="mb-3">
                                <ListGroup.Item><strong>Vrsta:</strong> {product.style}</ListGroup.Item>
                                <ListGroup.Item><strong>Jacina:</strong> {product.strength}</ListGroup.Item>
                                <ListGroup.Item><strong>Ukus:</strong> {product.taste}</ListGroup.Item>
                                <ListGroup.Item><strong>Stanje:</strong> {product.countInStock} komada</ListGroup.Item>
                            </ListGroup>

                            {addedToCart && (
                                <Alert variant="success">
                                    Proizvod je dodat u korpu.
                                </Alert>
                            )}

                            <div className="detail-buy-box">
                                <strong>{product.price.toFixed(2)} RSD</strong>
                                <Form.Select
                                    value={qty}
                                    disabled={product.countInStock === 0}
                                    onChange={(event) => setQty(Number(event.target.value))}
                                >
                                    {[...Array(product.countInStock).keys()].slice(0, 10).map((x) => (
                                        <option key={x + 1} value={x + 1}>{x + 1}</option>
                                    ))}
                                </Form.Select>
                                <Button
                                    variant="primary"
                                    disabled={product.countInStock === 0}
                                    onClick={() => {
                                        addToCart(product, qty);
                                        setAddedToCart(true);
                                    }}
                                >
                                    Dodaj u korpu
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="g-4 mt-1">
                <Col md={7}>
                    <Card className="detail-card">
                        <Card.Body>
                            <h2>Komentari</h2>
                            {comments.length === 0 ? (
                                <p className="text-muted">Jos nema komentara za ovo pivo.</p>
                            ) : (
                                <ListGroup variant="flush">
                                    {comments.map((item, index) => (
                                        <ListGroup.Item key={`${item.name}-${index}`}>
                                            <strong>{item.name}</strong>
                                            <Rating value={item.rating} text="" />
                                            <p className="mb-2">{item.comment}</p>
                                            {item.image && (
                                                <Image src={item.image} alt="Slika komentara" thumbnail className="comment-image" />
                                            )}
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={5}>
                    <Card className="detail-card">
                        <Card.Body>
                            <h2>Dodaj komentar</h2>
                            <Form onSubmit={submitCommentHandler}>
                                <Form.Group className="mb-3" controlId="rating">
                                    <Form.Label>Ocena</Form.Label>
                                    <div
                                        className="review-rating-input"
                                        onMouseLeave={() => setHoverRating(0)}
                                    >
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                aria-label={`${star} od 5 zvezdica`}
                                                className={star <= (hoverRating || rating) ? 'active' : ''}
                                                key={star}
                                                onClick={() => setRating(star)}
                                                onMouseEnter={() => setHoverRating(star)}
                                                type="button"
                                            >
                                                <svg viewBox="0 0 24 24" aria-hidden="true">
                                                    <polygon points="12 2 14.9 8.6 22 9.2 16.6 13.8 18.2 20.8 12 17.1 5.8 20.8 7.4 13.8 2 9.2 9.1 8.6" />
                                                </svg>
                                            </button>
                                        ))}
                                        <span>{rating} od 5</span>
                                    </div>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="comment">
                                    <Form.Label>Komentar</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={4}
                                        value={comment}
                                        onChange={(event) => setComment(event.target.value)}
                                        placeholder="Napisite utisak o pivu"
                                    />
                                </Form.Group>
                                <Button type="submit" variant="primary">Sacuvaj komentar</Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default ProductScreen;
