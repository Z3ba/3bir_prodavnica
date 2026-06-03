import { useState } from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginScreen = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const submitHandler = (event) => {
        event.preventDefault();
        login(email, password);
        navigate('/');
    };

    return (
        <Card className="form-card">
            <Card.Body>
                <h1>Prijava</h1>
                <Form onSubmit={submitHandler}>
                    <Form.Group className="mb-3" controlId="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            value={email}
                            placeholder="Unesite email"
                            onChange={(event) => setEmail(event.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="password">
                        <Form.Label>Lozinka</Form.Label>
                        <Form.Control
                            type="password"
                            value={password}
                            placeholder="Unesite lozinku"
                            onChange={(event) => setPassword(event.target.value)}
                            required
                        />
                    </Form.Group>
                    <Button type="submit" variant="primary">
                        Prijavi se
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default LoginScreen;
