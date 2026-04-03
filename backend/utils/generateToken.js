import jwt from 'jsonwebtoken';

export const generateToken = (userId) =>
  jwt.sign({ _id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
