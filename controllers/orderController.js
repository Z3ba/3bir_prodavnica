import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';

const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    pickupLocation,
    deliveryType,
    itemsPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error('Nema proizvoda u porudzbini');
  }

  for (const item of orderItems) {
    const product = await Product.findById(item.product || item._id);

    if (!product) {
      res.status(404);
      throw new Error(`Pivo nije pronadjeno: ${item.name}`);
    }

    if (product.countInStock < item.qty) {
      res.status(400);
      throw new Error(`Nema dovoljno na stanju: ${product.name}`);
    }
  }

  for (const item of orderItems) {
    await Product.updateOne(
      { _id: item.product || item._id },
      { $inc: { countInStock: -Number(item.qty) } }
    );
  }

  const order = new Order({
    orderItems: orderItems.map((item) => ({
      name: item.name,
      qty: item.qty,
      image: item.image,
      price: item.price,
      product: item.product || item._id,
    })),
    user: req.user._id,
    shippingAddress,
    paymentMethod,
    pickupLocation: pickupLocation || '',
    deliveryType,
    itemsPrice,
    shippingPrice,
    totalPrice,
    status: paymentMethod === 'Placanje u lokalu' ? 'Preuzimanje' : 'Nova',
    isPaid: paymentMethod === 'Online placanje',
    paidAt: paymentMethod === 'Online placanje' ? Date.now() : undefined,
  });

  const createdOrder = await order.save();
  res.status(201).json(createdOrder);
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (order) {
    if (order.user._id.toString() === req.user._id.toString() || req.user.isAdmin) {
      res.json(order);
    } else {
      res.status(401);
      throw new Error('Niste autorizovani za ovu porudzbinu');
    }
  } else {
    res.status(404);
    throw new Error('Porudzbina nije pronadjena');
  }
});

const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name email').sort({ createdAt: -1 });
  res.json(orders);
});

const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.status = 'Placena';

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Porudzbina nije pronadjena');
  }
});

const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    order.status = 'Isporucena';

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Porudzbina nije pronadjena');
  }
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.status = req.body.status || order.status;

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Porudzbina nije pronadjena');
  }
});

export { addOrderItems, getOrderById, getMyOrders, getOrders, updateOrderToPaid, updateOrderToDelivered, updateOrderStatus };
