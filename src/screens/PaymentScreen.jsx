import { useState } from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const PaymentScreen = () => {
    const navigate = useNavigate();
    const [paymentMethod, setPaymentMethod] = useState(
        localStorage.getItem('paymentMethod') || 'Online placanje'
    );

    const submitHandler = (event) => {
        event.preventDefault();
        localStorage.setItem('paymentMethod', paymentMethod);
        navigate('/placeorder');
    };

    return (
        <Card className="form-card">
            <Card.Body>
                <h1>Placanje</h1>
                <Form onSubmit={submitHandler}>
                    <Form.Check
                        className="mb-2"
                        type="radio"
                        id="online-payment"
                        label="Online placanje"
                        value="Online placanje"
                        checked={paymentMethod === 'Online placanje'}
                        onChange={(event) => setPaymentMethod(event.target.value)}
                    />
                    <Form.Check
                        className="mb-2"
                        type="radio"
                        id="local-payment"
                        label="Placanje u lokalu"
                        value="Placanje u lokalu"
                        checked={paymentMethod === 'Placanje u lokalu'}
                        onChange={(event) => setPaymentMethod(event.target.value)}
                    />
                    <Form.Check
                        className="mb-3"
                        type="radio"
                        id="cash-payment"
                        label="Pouzecem"
                        value="Pouzecem"
                        checked={paymentMethod === 'Pouzecem'}
                        onChange={(event) => setPaymentMethod(event.target.value)}
                    />
                    <Button type="submit" variant="primary">Nastavi</Button>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default PaymentScreen;
