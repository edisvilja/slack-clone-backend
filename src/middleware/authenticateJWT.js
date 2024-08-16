import jwt from 'jsonwebtoken'

export const authenticateJWT = (req, res, next) => {
  const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '')

  if (!token) {
    return res.status(403).json({ message: 'Token missing or invalid' })
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized' })
    }
    req.user = decoded
    next()
  })
}
