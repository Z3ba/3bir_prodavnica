import { Button, Card, Col, Form, Image, ListGroup, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartScreen = () => {
    const navigate = useNavigate();
    const { cartItems, itemsPrice, removeFromCart, updateQty } = useCart();

    return (
        <Row className="g-4">
            <Col md={8}>
                <h1>Korpa</h1>
                {cartItems.length === 0 ? (
                    <Card className="p-4">
                        <p>Korpa je prazna.</p>
                        <Link to="/">Vrati se na katalog</Link>
                    </Card>
                ) : (
                    <ListGroup variant="flush">
                        {cartItems.map((item) => (
                            <ListGroup.Item key={item._id}>
                                <Row className="align-items-center g-3">
                                    <Col xs={3} md={2}>
                                        <Image src={item.image} alt={item.name} fluid rounded />
                                    </Col>
                                    <Col xs={9} md={4}>
                                        <Link to={`/product/${item._id}`}>{item.name}</Link>
                                        <div className="text-muted small">{item.style}</div>
                                    </Col>
                                    <Col md={2}>{item.price.toFixed(2)} RSD</Col>
                                    <Col md={2}>
                                        <Form.Select
                                            value={item.qty}
                                            onChange={(event) => updateQty(item._id, Number(event.target.value))}
                                        >
                                            {[...Array(item.countInStock).keys()].slice(0, 10).map((x) => (
                                                <option key={x + 1} value={x + 1}>{x + 1}</option>
                                            ))}
                                        </Form.Select>
                                    </Col>
                                    <Col md={2}>
                                        <Button variant="outline-danger" onClick={() => removeFromCart(item._id)}>
                                            Obrisi
                                        </Button>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                )}
            </Col>
            <Col md={4}>
                <Card className="checkout-card">
                    <Card.Body>
                        <h2>Ukupno</h2>
                        <p>{cartItems.length} razlicitih proizvoda</p>
                        <h3>{itemsPrice.toFixed(2)} RSD</h3>
                        <Button
                            className="w-100"
                            variant="primary"
                            disabled={cartItems.length === 0}
                            onClick={() => navigate('/shipping')}
                        >
                            Nastavi na dostavu
                        </Button>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
};

export default CartScreen;
