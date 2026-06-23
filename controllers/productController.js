import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';

const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ createdAt: 1 });
  res.json(products);
});

const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Pivo nije pronadjeno');
  }
});

const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    user: req.user._id,
    name: req.body.name || 'Novo pivo',
    image: req.body.image || 'https://media2.3bir.rs/2018/12/3Bir-Logo-web.png',
    description: req.body.description || 'Novo pivo u 3Bir katalogu.',
    category: req.body.category || 'Ale',
    style: req.body.style || 'Craft beer',
    strength: req.body.strength || '5.0%',
    taste: req.body.taste || 'Craft ukus',
    price: Number(req.body.price) || 0,
    countInStock: Number(req.body.countInStock) || 0,
    rating: 0,
    numReviews: 0,
    reviews: [],
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = req.body.name ?? product.name;
    product.image = req.body.image ?? product.image;
    product.description = req.body.description ?? product.description;
    product.category = req.body.category ?? product.category;
    product.style = req.body.style ?? product.style;
    product.strength = req.body.strength ?? product.strength;
    product.taste = req.body.taste ?? product.taste;
    product.price = req.body.price !== undefined ? Number(req.body.price) : product.price;
    product.countInStock = req.body.countInStock !== undefined ? Number(req.body.countInStock) : product.countInStock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Pivo nije pronadjeno');
  }
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await Product.deleteOne({ _id: product._id });
    res.json({ message: 'Pivo je obrisano' });
  } else {
    res.status(404);
    throw new Error('Pivo nije pronadjeno');
  }
});

const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (review) => review.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Vec ste ocenili ovo pivo');
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Recenzija je dodata' });
  } else {
    res.status(404);
    throw new Error('Pivo nije pronadjeno');
  }
});

export { getProducts, getProductById, createProduct, updateProduct, deleteProduct, createProductReview };
