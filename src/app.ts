import fastify from 'fastify'
import { transactionsRoute } from './routes'
import cookie from '@fastify/cookie'
import { randomUUID } from 'crypto'

export const app = fastify()

app.register(cookie)

app.post('/signin', async (req, res) => {
  const { username, password } = req.body as {
    username: string
    password: string
  }

  if (username === 'admin' && password === 'admin') {
    res.setCookie('sessionId', 'admin-session-id', {
      path: '/',
    })
    res.code(200).send({ message: 'Admin logged' })
  }

  res.setCookie('sessionId', randomUUID(), {
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
  res.code(200).send({ message: 'User logged successfully' })
})

app.register(transactionsRoute, {
  // as rotas serão acessadas através do prefixo /transaction
  prefix: '/transactions',
})
