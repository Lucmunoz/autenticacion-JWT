import { jwtVerify } from '../../utils/auth/jwt.js'

export const authToken = (req, res, next) => {
  const autorization = req.header('authorization')
  if (autorization === undefined) {
    return res.status(401).json({ status: false, message: 'token no proporcionado' })
  }
  const [bearer, token] = autorization.split(' ')
  if (bearer !== 'Bearer') { return res.status(401).json({ status: false, message: 'token mal formulado' }) }

  try {
    jwtVerify(token) && next()
  } catch (error) {
    return res.status(401).json({ status: false, message: 'Token invalido' })
  }
}
