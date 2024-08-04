import jwt from 'jsonwebtoken'

const JWTKEY = process.env.JWT_KEY

export const jwtSign = (payload) => { return jwt.sign(payload, JWTKEY, { expiresIn: '1h' }) }

export const jwtVerify = (token) => { return jwt.verify(token, JWTKEY) }

export const jwtDecode = (token) => { return jwt.decode(token, JWTKEY) }
