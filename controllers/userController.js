import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    const token = generateToken(res, user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      role: user.isAdmin ? 'administrator' : 'korisnik',
      token,
    });
  } else {
    res.status(401);
    throw new Error('Email ili lozinka nisu ispravni');
  }
});

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('Korisnik vec postoji');
  }

  const user = await User.create({ name, email, password });

  if (user) {
    const token = generateToken(res, user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      role: user.isAdmin ? 'administrator' : 'korisnik',
      token,
    });
  } else {
    res.status(400);
    throw new Error('Neispravni podaci korisnika');
  }
});

const logoutUser = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: 'Korisnik je odjavljen' });
};

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      role: user.isAdmin ? 'administrator' : 'korisnik',
    });
  } else {
    res.status(404);
    throw new Error('Korisnik nije pronadjen');
  }
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    const token = generateToken(res, updatedUser._id);

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      role: updatedUser.isAdmin ? 'administrator' : 'korisnik',
      token,
    });
  } else {
    res.status(404);
    throw new Error('Korisnik nije pronadjen');
  }
});

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password').sort({ createdAt: -1 });
  res.json(users.map((user) => ({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    role: user.isAdmin ? 'administrator' : 'korisnik',
    createdAt: user.createdAt,
  })));
});

export { authUser, registerUser, logoutUser, getUserProfile, updateUserProfile, getUsers };
