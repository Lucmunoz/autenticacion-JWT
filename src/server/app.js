import express from 'express'
import cors from 'cors'
import morgan from 'morgan'

import { getByEmail, createUser, verificarCredenciales } from './models/db_models.js'
import { jwtSign, jwtDecode } from '../utils/auth/jwt.js'
import { authToken } from './middleware/auth.middleware.js'

const PORT = process.env.PORT ?? 3000
const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (email === '' || email === undefined || password === '' || password === undefined) {
      const newError = { status: false, message: 'Debes completar todos los campos' }
      throw newError
    }
    await verificarCredenciales(email, password)
    const token = jwtSign({ email })
    res.status(200).json({ token })
  } catch (error) {
    res.status(400).json({ status: false, message: error.message })
  }
})

app.post('/usuarios', async (req, res) => {
  try {
    const { email, password, rol, lenguage } = req.body
    await createUser({ email, password, rol, lenguage })
    res.status(201).json({ status: true, message: 'Usuario creado con exito' })
  } catch (error) {
    res.status(500).json({ status: false, message: error })
  }
})

app.get('/usuarios', authToken, async (req, res) => {
  try {
    const autorization = req.header('authorization')
    const [, token] = autorization.split(' ')
    const { email } = jwtDecode(token)
    const userData = await getByEmail(email)
    res.status(200).json(userData)
  } catch (error) {
    res.status(400).json({ status: false, message: error })
  }
})

// No exigidos en el desafío.
app.put('/', (req, res) => { })
app.delete('/', (req, res) => { })
app.all('*', (req, res) => { })

app.listen(PORT, () => console.log('=> Server Up and listening...!'))

export default app
