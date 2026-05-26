import { Badge, Container, Nav, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Header = () => {
    const { itemsCount } = useCart();

    return (
        <Navbar className="site-header" variant="dark" expand="md">
            <Container>
                <Navbar.Brand as={Link} to="/" className="brand">
                    <img
                        className="brand-logo"
                        src="https://media2.3bir.rs/2018/12/3Bir-Logo-web.png"
                        alt="3Bir logo"
                    />
                    <span>
                        <strong>3Bir</strong>
                        Prodavnica
                    </span>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="main-nav" />
                <Navbar.Collapse id="main-nav">
                    <Nav className="ms-auto">
                        <Nav.Link as={Link} to="/">Katalog</Nav.Link>
                        <Nav.Link as={Link} to="/admin">Admin</Nav.Link>
                        <Nav.Link as={Link} to="/cart">
                            Korpa
                            {itemsCount > 0 && (
                                <Badge bg="primary" pill className="ms-2">{itemsCount}</Badge>
                            )}
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;
