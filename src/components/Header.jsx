const Header = () => {
    return (
        <header className="site-header">
            <a className="brand" href="/">
                <span className="brand-mark">3</span>
                <span>
                    <strong>3Bir</strong>
                    Prodavnica
                </span>
            </a>
            <nav className="site-nav">
                <a href="/">Katalog</a>
                <a href="/cart">Korpa</a>
            </nav>
        </header>
    );
};

export default Header;
