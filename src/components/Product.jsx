import Rating from './Rating';

const Product = ({ product }) => {
    return (
        <article className="product-card">
            <div className="product-image-wrap">
                <img src={product.image} alt={product.name} />
                <span className="product-badge">{product.category}</span>
            </div>
            <div className="product-body">
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <div className="beer-meta">
                    <span>{product.style}</span>
                    <span>{product.strength}</span>
                    <span>{product.taste}</span>
                </div>
                <Rating value={product.rating} text={`${product.numReviews} recenzija`} />
                <div className="product-footer">
                    <strong>{product.price.toFixed(2)} RSD</strong>
                    <span>{product.countInStock > 0 ? `${product.countInStock} na stanju` : 'Nema na stanju'}</span>
                </div>
            </div>
        </article>
    );
};

export default Product;
