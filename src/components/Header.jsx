import { Container, Nav, Navbar } from 'react-bootstrap';

const Header = () => {
    return (
        <Navbar className="site-header" variant="dark" expand="md">
            <Container>
                <Navbar.Brand href="/" className="brand">
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
                        <Nav.Link href="/">Katalog</Nav.Link>
                        <Nav.Link href="/cart">Korpa</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;
