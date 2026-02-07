import jwt from 'jsonwebtoken'
import User from '../models/User.js'

// 🔐 Protect routes with JWT
export const protect = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken
    if (!token) {
      return res.status(401).json({ message: 'NO_TOKEN' })
    }

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
}


// 🔐 Role-based authorization (reusable for any role)
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' })
    }
    next()
  }
};