import { useEffect, useState } from 'react';
import { Alert, Badge, Card, Col, ListGroup, Row } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { getOrder } from '../api';

const OrderScreen = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadOrder = async () => {
            try {
                const data = await getOrder(id);
                setOrder(data);
            } catch (err) {
                setError(err.message || 'Porudzbina nije ucitana');
            } finally {
                setLoading(false);
            }
        };

        loadOrder();
    }, [id]);

    if (loading) {
        return <Alert variant="info">Ucitavanje porudzbine...</Alert>;
    }

    if (error) {
        return <Alert variant="danger">{error}</Alert>;
    }

    if (!order) {
        return <Alert variant="warning">Porudzbina nije pronadjena.</Alert>;
    }

    return (
        <Row className="g-4">
            <Col md={8}>
                <Card className="mb-3">
                    <Card.Body>
                        <div className="section-heading mb-3">
                            <div>
                                <span className="section-eyebrow">Porudzbina</span>
                                <h1>#{order._id}</h1>
                            </div>
                            <Badge bg={order.isDelivered ? 'success' : 'primary'}>{order.status}</Badge>
                        </div>
                        <p className="mb-0">
                            Placanje: {order.paymentMethod}<br />
                            Isporuka: {order.deliveryType}
                        </p>
                    </Card.Body>
                </Card>

                <Card className="mb-3">
                    <Card.Body>
                        <h2>{order.deliveryType === 'Preuzimanje u lokalu' ? 'Preuzimanje' : 'Dostava'}</h2>
                        {order.deliveryType === 'Preuzimanje u lokalu' ? (
                            <p className="mb-0">{order.pickupLocation}</p>
                        ) : (
                            <p className="mb-0">
                                {order.shippingAddress.fullName}<br />
                                {order.shippingAddress.address}, {order.shippingAddress.city}<br />
                                {order.shippingAddress.phone}
                            </p>
                        )}
                    </Card.Body>
                </Card>

                <Card>
                    <Card.Body>
                        <h2>Proizvodi</h2>
                        <ListGroup variant="flush">
                            {order.orderItems.map((item) => (
                                <ListGroup.Item key={item._id}>
                                    <Link to={`/product/${item.product}`}>{item.name}</Link>
                                    <span className="float-end">
                                        {item.qty} x {item.price.toFixed(2)} RSD
                                    </span>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Card.Body>
                </Card>
            </Col>
            <Col md={4}>
                <Card className="checkout-card">
                    <Card.Body>
                        <h2>Ukupno</h2>
                        <ListGroup variant="flush">
                            <ListGroup.Item>Proizvodi: {order.itemsPrice.toFixed(2)} RSD</ListGroup.Item>
                            <ListGroup.Item>Dostava: {order.shippingPrice.toFixed(2)} RSD</ListGroup.Item>
                            <ListGroup.Item><strong>Ukupno: {order.totalPrice.toFixed(2)} RSD</strong></ListGroup.Item>
                        </ListGroup>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
};

export default OrderScreen;
