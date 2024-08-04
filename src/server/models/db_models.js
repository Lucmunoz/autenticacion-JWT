import db from '../../database/db_connect.js'
import bcrypt from 'bcryptjs'

const DB_TABLE = process.env.DB_TABLENAME

export const getByEmail = async (email) => {
  const query = `SELECT email, rol, lenguage FROM ${DB_TABLE} WHERE email=$1;`
  const values = [email]
  return await db(query, values)
}

export const createUser = async ({ email, password, rol, lenguage }) => {
  const query = `INSERT INTO ${DB_TABLE}(id,email,password,rol,lenguage) VALUES (DEFAULT, $1,$2,$3,$4) RETURNING *;`
  const encriptedPassword = bcrypt.hashSync(password)
  const values = [email, encriptedPassword, rol, lenguage]
  const response = await db(query, values)
  if (response.length === 0) {
    const newError = { status: false, message: 'No se pudo crear el unsuario.' }
    throw newError
  }
}

export const verificarCredenciales = async (email, password) => {
  const query = 'SELECT * FROM usuarios WHERE email =$1;'
  const values = [email]
  const [response] = await db(query, values)
  const passwordMatch = bcrypt.compareSync(password, response.password)
  if (passwordMatch === false || response.length === 0) {
    const newError = { status: false, message: 'No se encontró ningun unsuario.' }
    throw newError
  }
}
