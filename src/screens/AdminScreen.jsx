import { useEffect, useState } from 'react';
import { Alert, Badge, Button, Card, Col, Form, Row, Tab, Table, Tabs } from 'react-bootstrap';
import { createProduct, deleteProduct, getOrders, getProducts, getUsers, markOrderDelivered, updateOrderStatus, updateProduct } from '../api';

const emptyProduct = {
    name: '',
    category: '',
    style: '',
    strength: '',
    taste: '',
    price: '',
    countInStock: '',
    image: '',
    description: '',
};

const AdminScreen = () => {
    const [adminProducts, setAdminProducts] = useState([]);
    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [formProduct, setFormProduct] = useState(emptyProduct);
    const [editingId, setEditingId] = useState(null);
    const [productSearch, setProductSearch] = useState('');
    const [userSearch, setUserSearch] = useState('');
    const [orderSearch, setOrderSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const loadAdminData = async () => {
        setLoading(true);
        setError('');

        try {
            const [productsData, usersData, ordersData] = await Promise.all([
                getProducts(),
                getUsers(),
                getOrders(),
            ]);
            setAdminProducts(productsData);
            setUsers(usersData);
            setOrders(ordersData);
        } catch (err) {
            setError(err.message || 'Admin podaci nisu ucitani');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAdminData();
    }, []);

    const filteredProducts = adminProducts.filter((product) => {
        const search = productSearch.trim().toLowerCase();
        const searchableText = [
            product.name,
            product.category,
            product.style,
            product.taste,
            product.strength,
        ].join(' ').toLowerCase();

        return !search || searchableText.includes(search);
    });

    const filteredUsers = users.filter((user) => {
        const search = userSearch.trim().toLowerCase();
        const searchableText = [
            user.name,
            user.email,
            user.role,
        ].join(' ').toLowerCase();

        return !search || searchableText.includes(search);
    });

    const filteredOrders = orders.filter((order) => {
        const search = orderSearch.trim().toLowerCase();
        const searchableText = [
            order._id,
            order.user?.name,
            order.user?.email,
            order.status,
            order.paymentMethod,
            order.totalPrice,
        ].join(' ').toLowerCase();

        return !search || searchableText.includes(search);
    });

    const submitHandler = async (event) => {
        event.preventDefault();
        setError('');
        setMessage('');

        const productData = {
            ...formProduct,
            price: Number(formProduct.price),
            countInStock: Number(formProduct.countInStock),
            image: formProduct.image || 'https://media2.3bir.rs/2018/12/3Bir-Logo-web.png',
            description: formProduct.description || `${formProduct.name} - pivo u 3Bir katalogu.`,
        };

        try {
            if (editingId) {
                await updateProduct(editingId, productData);
                setMessage('Pivo je izmenjeno.');
            } else {
                await createProduct(productData);
                setMessage('Pivo je dodato.');
            }

            setEditingId(null);
            setFormProduct(emptyProduct);
            await loadAdminData();
        } catch (err) {
            setError(err.message || 'Pivo nije sacuvano');
        }
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
            image: product.image,
            description: product.description,
        });
    };

    const deleteProductHandler = async (productId) => {
        setError('');
        setMessage('');

        try {
            await deleteProduct(productId);
            setMessage('Pivo je obrisano.');
            await loadAdminData();
        } catch (err) {
            setError(err.message || 'Pivo nije obrisano');
        }
    };

    const statusHandler = async (orderId, status) => {
        setError('');
        setMessage('');

        try {
            await updateOrderStatus(orderId, status);
            setMessage('Status porudzbine je izmenjen.');
            await loadAdminData();
        } catch (err) {
            setError(err.message || 'Status nije izmenjen');
        }
    };

    const deliverHandler = async (orderId) => {
        setError('');
        setMessage('');

        try {
            await markOrderDelivered(orderId);
            setMessage('Porudzbina je oznacena kao isporucena.');
            await loadAdminData();
        } catch (err) {
            setError(err.message || 'Porudzbina nije izmenjena');
        }
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

            {loading && <Alert variant="info">Ucitavanje admin podataka...</Alert>}
            {message && <Alert variant="success">{message}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}

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

            <Tabs defaultActiveKey="products" className="admin-tabs mb-3">
                <Tab eventKey="products" title="Proizvodi">
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
                                        <Form.Group className="mb-3" controlId="description">
                                            <Form.Label>Opis</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={3}
                                                value={formProduct.description}
                                                onChange={(event) => setFormProduct({ ...formProduct, description: event.target.value })}
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId="image">
                                            <Form.Label>Slika URL</Form.Label>
                                            <Form.Control
                                                value={formProduct.image}
                                                onChange={(event) => setFormProduct({ ...formProduct, image: event.target.value })}
                                            />
                                        </Form.Group>
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
                                    <div className="admin-table-heading">
                                        <h2>Proizvodi</h2>
                                        <Form.Control
                                            type="search"
                                            value={productSearch}
                                            placeholder="Pretrazi proizvode"
                                            onChange={(event) => setProductSearch(event.target.value)}
                                        />
                                    </div>
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
                                            {filteredProducts.map((product) => (
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
                                    {filteredProducts.length === 0 && (
                                        <p className="text-muted mb-0">Nema proizvoda za ovu pretragu.</p>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Tab>

                <Tab eventKey="users" title="Korisnici">
                    <Card className="admin-card">
                        <Card.Body>
                            <div className="admin-table-heading">
                                <h2>Korisnici</h2>
                                <Form.Control
                                    type="search"
                                    value={userSearch}
                                    placeholder="Pretrazi korisnike"
                                    onChange={(event) => setUserSearch(event.target.value)}
                                />
                            </div>
                            <Table responsive hover>
                                <thead>
                                    <tr>
                                        <th>Ime</th>
                                        <th>Email</th>
                                        <th>Uloga</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map((user) => (
                                        <tr key={user._id}>
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>
                                            <td>
                                                <Badge bg={user.isAdmin ? 'primary' : 'secondary'}>
                                                    {user.role || (user.isAdmin ? 'administrator' : 'korisnik')}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                            {filteredUsers.length === 0 && (
                                <p className="text-muted mb-0">Nema korisnika za ovu pretragu.</p>
                            )}
                        </Card.Body>
                    </Card>
                </Tab>

                <Tab eventKey="orders" title="Porudzbine">
                    <Card className="admin-card">
                        <Card.Body>
                            <div className="admin-table-heading">
                                <h2>Porudzbine</h2>
                                <Form.Control
                                    type="search"
                                    value={orderSearch}
                                    placeholder="Pretrazi porudzbine"
                                    onChange={(event) => setOrderSearch(event.target.value)}
                                />
                            </div>
                            <Table responsive hover>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Kupac</th>
                                        <th>Ukupno</th>
                                        <th>Status</th>
                                        <th>Akcije</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredOrders.map((order) => (
                                        <tr key={order._id}>
                                            <td>#{order._id.slice(-6)}</td>
                                            <td>{order.user?.name || 'Korisnik'}</td>
                                            <td>{Number(order.totalPrice).toFixed(2)} RSD</td>
                                            <td>
                                                <Badge bg={order.isDelivered ? 'success' : 'primary'}>
                                                    {order.status}
                                                </Badge>
                                            </td>
                                            <td>
                                                <div className="d-flex gap-2 flex-wrap">
                                                    <Form.Select
                                                        size="sm"
                                                        value={order.status}
                                                        onChange={(event) => statusHandler(order._id, event.target.value)}
                                                    >
                                                        <option>Nova</option>
                                                        <option>Placena</option>
                                                        <option>Preuzimanje</option>
                                                        <option>U obradi</option>
                                                        <option>Poslata</option>
                                                        <option>Isporucena</option>
                                                        <option>Otkazana</option>
                                                    </Form.Select>
                                                    <Button
                                                        size="sm"
                                                        variant="outline-success"
                                                        disabled={order.isDelivered}
                                                        onClick={() => deliverHandler(order._id)}
                                                    >
                                                        Isporucena
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                            {filteredOrders.length === 0 && (
                                <p className="text-muted mb-0">Nema porudzbina za ovu pretragu.</p>
                            )}
                        </Card.Body>
                    </Card>
                </Tab>
            </Tabs>
        </>
    );
};

export default AdminScreen;
