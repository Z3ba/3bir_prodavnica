import { useState } from 'react';
import { Badge, Button, Card, Col, Form, Row, Table } from 'react-bootstrap';
import products from '../products_list';

const users = [
    { id: 1, name: 'Marko Markovic', email: 'marko@email.com', role: 'korisnik' },
    { id: 2, name: 'Jovana Jovanovic', email: 'jovana@email.com', role: 'korisnik' },
    { id: 3, name: 'Admin 3Bir', email: 'admin@3bir.rs', role: 'administrator' },
];

const orders = [
    { id: 1001, customer: 'Marko Markovic', total: 1020, status: 'Nova', payment: 'Pouzecem' },
    { id: 1002, customer: 'Jovana Jovanovic', total: 740, status: 'Placena', payment: 'Online placanje' },
    { id: 1003, customer: 'Nikola Nikolic', total: 390, status: 'Preuzimanje', payment: 'Placanje u lokalu' },
];

const emptyProduct = {
    name: '',
    category: '',
    style: '',
    strength: '',
    taste: '',
    price: '',
    countInStock: '',
};

const AdminScreen = () => {
    const [adminProducts, setAdminProducts] = useState(products);
    const [formProduct, setFormProduct] = useState(emptyProduct);
    const [editingId, setEditingId] = useState(null);

    const submitHandler = (event) => {
        event.preventDefault();

        const productData = {
            ...formProduct,
            price: Number(formProduct.price),
            countInStock: Number(formProduct.countInStock),
            image: 'https://media2.3bir.rs/2018/12/3Bir-Logo-web.png',
            description: `${formProduct.name} - novo pivo u 3Bir admin katalogu.`,
            rating: 0,
            numReviews: 0,
            reviews: [],
        };

        if (editingId) {
            setAdminProducts((items) =>
                items.map((item) => item._id === editingId ? { ...item, ...productData, _id: editingId } : item)
            );
        } else {
            setAdminProducts((items) => [
                ...items,
                { ...productData, _id: String(Date.now()) },
            ]);
        }

        setEditingId(null);
        setFormProduct(emptyProduct);
    };

    const editProductHandler = (product) => {
        setEditingId(product._id);
        setFormProduct({
            name: product.name,
            category: product.category,
            style: product.style,
            strength: product.strength,
            taste: product.taste,
            price: product.price,
            countInStock: product.countInStock,
        });
    };

    const deleteProductHandler = (productId) => {
        setAdminProducts((items) => items.filter((item) => item._id !== productId));
    };

    return (
        <>
            <div className="section-heading mb-4">
                <div>
                    <span className="section-eyebrow">Admin panel</span>
                    <h1>Upravljanje prodavnicom</h1>
                </div>
                <p>Pregled proizvoda, korisnika i porudzbina.</p>
            </div>

            <Row className="g-3 mb-4">
                <Col md={4}>
                    <Card className="admin-stat">
                        <Card.Body>
                            <span>Proizvodi</span>
                            <strong>{adminProducts.length}</strong>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="admin-stat">
                        <Card.Body>
                            <span>Korisnici</span>
                            <strong>{users.length}</strong>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="admin-stat">
                        <Card.Body>
                            <span>Porudzbine</span>
                            <strong>{orders.length}</strong>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="g-4">
                <Col lg={5}>
                    <Card className="admin-card">
                        <Card.Body>
                            <h2>{editingId ? 'Izmeni pivo' : 'Dodaj novo pivo'}</h2>
                            <Form onSubmit={submitHandler}>
                                <Form.Group className="mb-3" controlId="name">
                                    <Form.Label>Naziv</Form.Label>
                                    <Form.Control
                                        value={formProduct.name}
                                        onChange={(event) => setFormProduct({ ...formProduct, name: event.target.value })}
                                        required
                                    />
                                </Form.Group>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="category">
                                            <Form.Label>Vrsta</Form.Label>
                                            <Form.Control
                                                value={formProduct.category}
                                                onChange={(event) => setFormProduct({ ...formProduct, category: event.target.value })}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="style">
                                            <Form.Label>Stil</Form.Label>
                                            <Form.Control
                                                value={formProduct.style}
                                                onChange={(event) => setFormProduct({ ...formProduct, style: event.target.value })}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="strength">
                                            <Form.Label>Jacina</Form.Label>
                                            <Form.Control
                                                value={formProduct.strength}
                                                placeholder="5.5%"
                                                onChange={(event) => setFormProduct({ ...formProduct, strength: event.target.value })}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="taste">
                                            <Form.Label>Ukus</Form.Label>
                                            <Form.Control
                                                value={formProduct.taste}
                                                onChange={(event) => setFormProduct({ ...formProduct, taste: event.target.value })}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="price">
                                            <Form.Label>Cena</Form.Label>
                                            <Form.Control
                                                type="number"
                                                value={formProduct.price}
                                                onChange={(event) => setFormProduct({ ...formProduct, price: event.target.value })}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="stock">
                                            <Form.Label>Stanje</Form.Label>
                                            <Form.Control
                                                type="number"
                                                value={formProduct.countInStock}
                                                onChange={(event) => setFormProduct({ ...formProduct, countInStock: event.target.value })}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <div className="d-flex gap-2">
                                    <Button type="submit" variant="primary">
                                        {editingId ? 'Sacuvaj izmene' : 'Dodaj pivo'}
                                    </Button>
                                    {editingId && (
                                        <Button
                                            type="button"
                                            variant="outline-secondary"
                                            onClick={() => {
                                                setEditingId(null);
                                                setFormProduct(emptyProduct);
                                            }}
                                        >
                                            Odustani
                                        </Button>
                                    )}
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={7}>
                    <Card className="admin-card">
                        <Card.Body>
                            <h2>Proizvodi</h2>
                            <Table responsive hover>
                                <thead>
                                    <tr>
                                        <th>Naziv</th>
                                        <th>Vrsta</th>
                                        <th>Cena</th>
                                        <th>Stanje</th>
                                        <th>Akcije</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {adminProducts.map((product) => (
                                        <tr key={product._id}>
                                            <td>{product.name}</td>
                                            <td>{product.category}</td>
                                            <td>{Number(product.price).toFixed(2)} RSD</td>
                                            <td>{product.countInStock}</td>
                                            <td>
                                                <div className="d-flex gap-2">
                                                    <Button size="sm" variant="outline-primary" onClick={() => editProductHandler(product)}>
                                                        Izmeni
                                                    </Button>
                                                    <Button size="sm" variant="outline-danger" onClick={() => deleteProductHandler(product._id)}>
                                                        Obrisi
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="g-4 mt-1">
                <Col lg={6}>
                    <Card className="admin-card">
                        <Card.Body>
                            <h2>Korisnici</h2>
                            <Table responsive hover>
                                <thead>
                                    <tr>
                                        <th>Ime</th>
                                        <th>Email</th>
                                        <th>Uloga</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user.id}>
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>
                                            <td>
                                                <Badge bg={user.role === 'administrator' ? 'primary' : 'secondary'}>
                                                    {user.role}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={6}>
                    <Card className="admin-card">
                        <Card.Body>
                            <h2>Porudzbine</h2>
                            <Table responsive hover>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Kupac</th>
                                        <th>Ukupno</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => (
                                        <tr key={order.id}>
                                            <td>#{order.id}</td>
                                            <td>{order.customer}</td>
                                            <td>{order.total.toFixed(2)} RSD</td>
                                            <td>{order.status}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default AdminScreen;
