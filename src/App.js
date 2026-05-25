import { useState } from 'react';
import { Alert, Button, Col, Container, Form, Row } from 'react-bootstrap';
import Header from './components/Header';
import Footer from './components/Footer';
import Product from './components/Product';
import products from './products_list';
import './App.css';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Sve vrste');

  const categories = ['Sve vrste', ...new Set(products.map((product) => product.category))];

  const filteredProducts = products.filter((product) => {
    const search = searchTerm.trim().toLowerCase();
    const searchableText = [
      product.name,
      product.category,
      product.style,
      product.taste,
      product.description,
    ].join(' ').toLowerCase();

    const matchesSearch = !search || searchableText.includes(search);
    const matchesCategory = selectedCategory === 'Sve vrste' || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('Sve vrste');
  };

  return (
    <>
      <Header />
      <Container as="main" className="py-4">
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

        <div className="section-heading mb-3">
          <div>
            <span className="section-eyebrow">Katalog</span>
            <h2>Izaberi svoje pivo</h2>
          </div>
          <p>{filteredProducts.length} od {products.length} piva se prikazuje.</p>
        </div>

        <Form className="catalog-toolbar mb-4">
          <Row className="g-3 align-items-end">
            <Col md={7}>
              <Form.Group controlId="search">
                <Form.Label>Pretraga</Form.Label>
                <Form.Control
                  type="search"
                  value={searchTerm}
                  placeholder="Naziv, vrsta ili ukus"
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group controlId="category">
                <Form.Label>Vrsta</Form.Label>
                <Form.Select
                  value={selectedCategory}
                  onChange={(event) => setSelectedCategory(event.target.value)}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={2}>
              <Button className="w-100" variant="dark" type="button" onClick={resetFilters}>
                Reset
              </Button>
            </Col>
          </Row>
        </Form>

        <Row className="g-4">
          {filteredProducts.map((product) => (
            <Col key={product._id} sm={12} md={6} lg={4}>
              <Product product={product} />
            </Col>
          ))}
        </Row>

        {filteredProducts.length === 0 && (
          <Alert variant="warning" className="mt-4">
            Nema piva za izabrane filtere.{' '}
            <Button variant="link" className="p-0 align-baseline" onClick={resetFilters}>
              Prikazi sve
            </Button>
          </Alert>
        )}
      </Container>
      <Footer />
    </>
  );
}

export default App;
