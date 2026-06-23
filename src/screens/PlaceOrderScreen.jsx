import { useState } from 'react';
import { Alert, Button, Card, Col, ListGroup, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { createOrder } from '../api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const PlaceOrderScreen = () => {
    const navigate = useNavigate();
    const { cartItems, itemsPrice, clearCart } = useCart();
    const { userInfo } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const shippingAddress = JSON.parse(localStorage.getItem('shippingAddress') || '{}');
    const paymentMethod = localStorage.getItem('paymentMethod') || 'Online placanje';
    const pickupLocation = localStorage.getItem('pickupLocation');
    const isLocalPickup = paymentMethod === 'Placanje u lokalu';
    const shippingPrice = isLocalPickup || itemsPrice > 5000 ? 0 : 300;
    const totalPrice = itemsPrice + shippingPrice;

    const placeOrderHandler = async () => {
        if (!userInfo) {
            navigate('/login');
            return;
        }

        setError('');
        setLoading(true);

        try {
            const order = await createOrder({
                orderItems: cartItems.map((item) => ({
                    name: item.name,
                    qty: item.qty,
                    image: item.image,
                    price: item.price,
                    product: item._id,
                })),
                shippingAddress,
                paymentMethod,
                pickupLocation: isLocalPickup ? pickupLocation : '',
                deliveryType: isLocalPickup ? 'Preuzimanje u lokalu' : 'Dostava',
                itemsPrice,
                shippingPrice,
                totalPrice,
            });

            localStorage.setItem('lastOrder', JSON.stringify(order));
            clearCart();
            navigate(`/order/${order._id}`);
        } catch (err) {
            setError(err.message || 'Porudzbina nije sacuvana');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Row className="g-4">
            <Col md={8}>
                {error && <Alert variant="danger">{error}</Alert>}
                {!userInfo && <Alert variant="warning">Morate biti prijavljeni da potvrdite porudzbinu.</Alert>}
                <Card className="mb-3">
                    <Card.Body>
                        <h2>{isLocalPickup ? 'Preuzimanje u lokalu' : 'Podaci za dostavu'}</h2>
                        {isLocalPickup ? (
                            <p className="mb-0">
                                {pickupLocation}<br />
                                Porudzbina se ne dostavlja, preuzimate je u izabranom lokalu.
                            </p>
                        ) : (
                            <p className="mb-0">
                                {shippingAddress.fullName}<br />
                                {shippingAddress.address}, {shippingAddress.city}<br />
                                {shippingAddress.phone}
                            </p>
                        )}
                    </Card.Body>
                </Card>

                <Card className="mb-3">
                    <Card.Body>
                        <h2>Nacin placanja</h2>
                        <p className="mb-0">{paymentMethod}</p>
                    </Card.Body>
                </Card>

                <Card>
                    <Card.Body>
                        <h2>Proizvodi</h2>
                        {cartItems.length === 0 ? (
                            <p>Korpa je prazna.</p>
                        ) : (
                            <ListGroup variant="flush">
                                {cartItems.map((item) => (
                                    <ListGroup.Item key={item._id}>
                                        <Link to={`/product/${item._id}`}>{item.name}</Link>
                                        <span className="float-end">
                                            {item.qty} x {item.price.toFixed(2)} RSD
                                        </span>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        )}
                    </Card.Body>
                </Card>
            </Col>

            <Col md={4}>
                <Card className="checkout-card">
                    <Card.Body>
                        <h2>Pregled</h2>
                        <ListGroup variant="flush" className="mb-3">
                            <ListGroup.Item>Proizvodi: {itemsPrice.toFixed(2)} RSD</ListGroup.Item>
                            <ListGroup.Item>
                                {isLocalPickup ? 'Preuzimanje u lokalu' : 'Dostava'}: {shippingPrice.toFixed(2)} RSD
                            </ListGroup.Item>
                            <ListGroup.Item><strong>Ukupno: {totalPrice.toFixed(2)} RSD</strong></ListGroup.Item>
                        </ListGroup>
                        <Button
                            className="w-100"
                            variant="primary"
                            disabled={cartItems.length === 0 || loading}
                            onClick={placeOrderHandler}
                        >
                            {loading ? 'Cuvanje...' : 'Potvrdi porudzbinu'}
                        </Button>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
};

export default PlaceOrderScreen;
