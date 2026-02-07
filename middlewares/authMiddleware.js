import jwt from 'jsonwebtoken'
import User from '../models/User.js'

// 🔐 Protect routes using Authorization header
export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'NO_TOKEN' })
    }

    const token = authHeader.replace('Bearer ', '')

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    if (decoded.type !== 'access') {
      return res.status(401).json({ message: 'INVALID_TOKEN_TYPE' })
    }

    const user = await User.findById(decoded.id).select('-password')
    if (!user) {
      return res.status(401).json({ message: 'USER_NOT_FOUND' })
    }

    req.user = user
    next()
  } catch (err) {
    return res.status(401).json({ message: 'UNAUTHORIZED' })
  }
};

// 🔐 Role-based authorization (keep for future)
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'ACCESS_DENIED' })
    }
    next()
  }
}