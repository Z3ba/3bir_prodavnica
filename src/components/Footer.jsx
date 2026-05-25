const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="site-footer">
            <p>&copy; {currentYear} 3Bir Prodavnica. Sva prava zadrzana.</p>
        </footer>
    );
};

export default Footer;
