import Header from './components/Header';
import Footer from './components/Footer';
import Product from './components/Product';
import products from './products_list';
import './App.css';

function App() {
  return (
    <>
      <Header />
      <main className="app-main">
        <section className="home-hero">
          <div className="hero-copy">
            <span className="hero-kicker">3Bir craft prodavnica</span>
            <h1>Piva iz 3Bir pivare za svaki ukus.</h1>
            <p>
              Pregledaj dostupna piva, njihove vrste, jacinu, ukus, cenu i stanje u prodavnici.
            </p>
          </div>
          <div className="hero-panel">
            <div>
              <strong>{products.length}</strong>
              <span>piva u katalogu</span>
            </div>
            <div>
              <strong>4.6+</strong>
              <span>prosecna ocena</span>
            </div>
            <div>
              <strong>3</strong>
              <span>nacina placanja uskoro</span>
            </div>
          </div>
        </section>

        <div className="section-heading">
          <div>
            <span className="section-eyebrow">Katalog</span>
            <h2>Izaberi svoje pivo</h2>
          </div>
          <p>Mock katalog za prvu frontend fazu 3Bir prodavnice.</p>
        </div>

        <section className="product-grid">
          {products.map((product) => (
            <Product key={product._id} product={product} />
          ))}
        </section>
      </main>
      <Footer />
    </>
  );
}

export default App;
