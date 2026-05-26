import { useState } from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const ShippingScreen = () => {
    const navigate = useNavigate();
    const savedShipping = JSON.parse(localStorage.getItem('shippingAddress') || '{}');
    const [fullName, setFullName] = useState(savedShipping.fullName || '');
    const [address, setAddress] = useState(savedShipping.address || '');
    const [city, setCity] = useState(savedShipping.city || '');
    const [phone, setPhone] = useState(savedShipping.phone || '');

    const submitHandler = (event) => {
        event.preventDefault();
        localStorage.setItem('shippingAddress', JSON.stringify({ fullName, address, city, phone }));
        navigate('/payment');
    };

    return (
        <Card className="form-card">
            <Card.Body>
                <h1>Dostava</h1>
                <Form onSubmit={submitHandler}>
                    <Form.Group className="mb-3" controlId="fullName">
                        <Form.Label>Ime i prezime</Form.Label>
                        <Form.Control value={fullName} onChange={(event) => setFullName(event.target.value)} required />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="address">
                        <Form.Label>Adresa</Form.Label>
                        <Form.Control value={address} onChange={(event) => setAddress(event.target.value)} required />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="city">
                        <Form.Label>Grad</Form.Label>
                        <Form.Control value={city} onChange={(event) => setCity(event.target.value)} required />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="phone">
                        <Form.Label>Telefon</Form.Label>
                        <Form.Control value={phone} onChange={(event) => setPhone(event.target.value)} required />
                    </Form.Group>
                    <Button type="submit" variant="primary">Nastavi</Button>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default ShippingScreen;
