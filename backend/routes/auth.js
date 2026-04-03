import express from 'express';
import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';

const router = express.Router();

/**
 * @route  POST /api/auth/signup
 * @desc   Register a new user
 * @access Public
 */
router.post('/signup', async (req, res, next) => {
  try {
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const user = await User.create({ name, username, email, password });
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
    });
  } catch (err) { next(err); }
});

/**
 * @route  POST /api/auth/login
 * @desc   Login user and return JWT
 * @access Public
 */
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);
    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (err) { next(err); }
});

export default router;
