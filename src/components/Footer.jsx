import { Container } from 'react-bootstrap';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="site-footer">
            <Container>
                <p>&copy; {currentYear} 3Bir Prodavnica. Sva prava zadrzana.</p>
            </Container>
        </footer>
    );
};

export default Footer;
