import jwt from 'jsonwebtoken';

/**
 * Generate JWT token
 * @param {String} userId - User ID
 * @returns {String} JWT token
 */
export const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || 'fallback_secret',
    {
      expiresIn: process.env.JWT_EXPIRE || '7d'
    }
  );
};

