import { useState } from 'react';
import { Alert, Button, Card, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterScreen = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const submitHandler = async (event) => {
        event.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Lozinke se ne poklapaju.');
            return;
        }

        setLoading(true);

        try {
            await register(name, email, password);
            navigate('/');
        } catch (err) {
            setError(err.message || 'Registracija nije uspela');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="form-card">
            <Card.Body>
                <h1>Registracija</h1>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={submitHandler}>
                    <Form.Group className="mb-3" controlId="name">
                        <Form.Label>Ime</Form.Label>
                        <Form.Control
                            value={name}
                            placeholder="Unesite ime"
                            onChange={(event) => setName(event.target.value)}
                            required
                        />
                    </Form.Group>
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
                            placeholder="Najmanje 6 karaktera"
                            minLength={6}
                            onChange={(event) => setPassword(event.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="confirmPassword">
                        <Form.Label>Potvrdi lozinku</Form.Label>
                        <Form.Control
                            type="password"
                            value={confirmPassword}
                            placeholder="Ponovite lozinku"
                            minLength={6}
                            onChange={(event) => setConfirmPassword(event.target.value)}
                            required
                        />
                    </Form.Group>
                    <div className="d-flex align-items-center gap-3 flex-wrap">
                        <Button type="submit" variant="primary" disabled={loading}>
                            {loading ? 'Kreiranje...' : 'Napravi nalog'}
                        </Button>
                        <span>
                            Vec imate nalog? <Link to="/login">Prijavite se</Link>
                        </span>
                    </div>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default RegisterScreen;