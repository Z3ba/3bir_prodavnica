import { Badge, Container, Nav, Navbar } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Header = () => {
    const navigate = useNavigate();
    const { userInfo, logout } = useAuth();
    const { itemsCount } = useCart();
    const isAdmin = userInfo?.role === 'administrator';

    const logoutHandler = () => {
        logout();
        navigate('/');
    };

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
                        {isAdmin && (
                            <Nav.Link as={Link} to="/admin">Admin</Nav.Link>
                        )}
                        <Nav.Link as={Link} to="/cart">
                            Korpa
                            {itemsCount > 0 && (
                                <Badge bg="primary" pill className="ms-2">{itemsCount}</Badge>
                            )}
                        </Nav.Link>
                        {userInfo ? (
                            <>
                                <Navbar.Text className="ms-md-2">
                                    {userInfo.email}
                                </Navbar.Text>
                                <Nav.Link as="button" className="logout-link" onClick={logoutHandler}>
                                    Odjavi se
                                </Nav.Link>
                            </>
                        ) : (
                            <Nav.Link as={Link} to="/login">Login</Nav.Link>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;
