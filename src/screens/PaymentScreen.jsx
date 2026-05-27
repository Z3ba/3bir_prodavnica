import { useState } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const pickupLocations = [
    'TapRoom--Futoski put 12',
    'CheckPoint Grbavic--Brace Ribnikar 1',
    'CheckPoint Centar--Njegoseva 4',
    'Stribor 3bir--Branka Bajica 2',
];

const PaymentScreen = () => {
    const navigate = useNavigate();
    const [paymentMethod, setPaymentMethod] = useState(
        localStorage.getItem('paymentMethod') || 'Online placanje'
    );
    const [cardName, setCardName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCvv, setCardCvv] = useState('');
    const [pickupLocation, setPickupLocation] = useState(
        localStorage.getItem('pickupLocation') || pickupLocations[0]
    );

    const formatCardNumber = (value) =>
        value
            .replace(/\D/g, '')
            .slice(0, 16)
            .replace(/(.{4})/g, '$1 ')
            .trim();

    const formatExpiry = (value) => {
        const digits = value.replace(/\D/g, '').slice(0, 4);

        if (digits.length < 3) {
            return digits;
        }

        return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    };

    const isOnlinePayment = paymentMethod === 'Online placanje';
    const isLocalPayment = paymentMethod === 'Placanje u lokalu';

    const submitHandler = (event) => {
        event.preventDefault();
        localStorage.setItem('paymentMethod', paymentMethod);

        if (isOnlinePayment) {
            localStorage.setItem('cardPayment', JSON.stringify({
                cardName,
                cardLastFour: cardNumber.replace(/\D/g, '').slice(-4),
            }));
        } else {
            localStorage.removeItem('cardPayment');
        }

        if (isLocalPayment) {
            localStorage.setItem('pickupLocation', pickupLocation);
        } else {
            localStorage.removeItem('pickupLocation');
        }

        navigate('/placeorder');
    };

    return (
        <Card className="form-card">
            <Card.Body>
                <h1>Placanje</h1>
                <Form onSubmit={submitHandler}>
                    <div className="payment-options">
                        <label className={isOnlinePayment ? 'payment-option active' : 'payment-option'} htmlFor="online-payment">
                            <Form.Check
                                type="radio"
                                id="online-payment"
                                label="Online placanje karticom"
                                value="Online placanje"
                                checked={isOnlinePayment}
                                onChange={(event) => setPaymentMethod(event.target.value)}
                            />
                            <span>Unesite podatke sa kartice i nastavite na pregled porudzbine.</span>
                        </label>

                        <label className={paymentMethod === 'Placanje u lokalu' ? 'payment-option active' : 'payment-option'} htmlFor="local-payment">
                            <Form.Check
                                type="radio"
                                id="local-payment"
                                label="Placanje u lokalu"
                                value="Placanje u lokalu"
                                checked={paymentMethod === 'Placanje u lokalu'}
                                onChange={(event) => setPaymentMethod(event.target.value)}
                            />
                            <span>Platite prilikom preuzimanja u nasoj prodavnici.</span>
                        </label>

                        <label className={paymentMethod === 'Pouzecem' ? 'payment-option active' : 'payment-option'} htmlFor="cash-payment">
                            <Form.Check
                                type="radio"
                                id="cash-payment"
                                label="Pouzecem"
                                value="Pouzecem"
                                checked={paymentMethod === 'Pouzecem'}
                                onChange={(event) => setPaymentMethod(event.target.value)}
                            />
                            <span>Kuriru placate gotovinom kada porudzbina stigne.</span>
                        </label>
                    </div>

                    {isOnlinePayment && (
                        <div className="card-payment-panel">
                            <div className="card-preview">
                                <span>3BIR CARD</span>
                                <strong>{cardNumber || '0000 0000 0000 0000'}</strong>
                                <div>
                                    <small>{cardName || 'IME NA KARTICI'}</small>
                                    <small>{cardExpiry || 'MM/GG'}</small>
                                </div>
                            </div>

                            <Row className="g-3">
                                <Col xs={12}>
                                    <Form.Group controlId="cardName">
                                        <Form.Label>Ime na kartici</Form.Label>
                                        <Form.Control
                                            value={cardName}
                                            onChange={(event) => setCardName(event.target.value.toUpperCase())}
                                            placeholder="MARKO MARKOVIC"
                                            required={isOnlinePayment}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={12}>
                                    <Form.Group controlId="cardNumber">
                                        <Form.Label>Broj kartice</Form.Label>
                                        <Form.Control
                                            inputMode="numeric"
                                            value={cardNumber}
                                            onChange={(event) => setCardNumber(formatCardNumber(event.target.value))}
                                            placeholder="1234 5678 9012 3456"
                                            required={isOnlinePayment}
                                            minLength={19}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col sm={6}>
                                    <Form.Group controlId="cardExpiry">
                                        <Form.Label>Datum isteka</Form.Label>
                                        <Form.Control
                                            inputMode="numeric"
                                            value={cardExpiry}
                                            onChange={(event) => setCardExpiry(formatExpiry(event.target.value))}
                                            placeholder="MM/GG"
                                            required={isOnlinePayment}
                                            minLength={5}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col sm={6}>
                                    <Form.Group controlId="cardCvv">
                                        <Form.Label>CVV</Form.Label>
                                        <Form.Control
                                            inputMode="numeric"
                                            type="password"
                                            value={cardCvv}
                                            onChange={(event) => setCardCvv(event.target.value.replace(/\D/g, '').slice(0, 4))}
                                            placeholder="123"
                                            required={isOnlinePayment}
                                            minLength={3}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </div>
                    )}

                    {isLocalPayment && (
                        <div className="pickup-panel">
                            <h2>Izaberite lokal za preuzimanje</h2>
                            <div className="pickup-options">
                                {pickupLocations.map((location) => (
                                    <label
                                        className={pickupLocation === location ? 'pickup-option active' : 'pickup-option'}
                                        htmlFor={`pickup-${location}`}
                                        key={location}
                                    >
                                        <Form.Check
                                            type="radio"
                                            id={`pickup-${location}`}
                                            name="pickupLocation"
                                            label={location}
                                            value={location}
                                            checked={pickupLocation === location}
                                            onChange={(event) => setPickupLocation(event.target.value)}
                                            required={isLocalPayment}
                                        />
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    <Button className="mt-4 w-100" type="submit" variant="primary">Nastavi na pregled</Button>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default PaymentScreen;
