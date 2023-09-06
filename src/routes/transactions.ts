import { FastifyInstance } from 'fastify'
import { prisma } from '../services/prisma'
import { checkIfSessionIdExists } from '../middlewares'

interface ICreateTransactionBody {
  title: string
  amount: number
  type: 'credit' | 'debit'
}

interface IGetTransactionsParams {
  id: string
}

export default async function transactionsRoute(app: FastifyInstance) {
  // Middleware global (somente nesse contexto)
  // para verificar se o sessionId existe em todos os endpoints
  app.addHook('preHandler', checkIfSessionIdExists)

  // List all transactions
  app.get('/', async (req, res) => {
    // Se o sessionId for igual a 'admin-session-id',
    // retorna undefined para pegar TODOS as transações,
    // caso contrário, retorna req.cookies.sessionId,
    // para retornar apenas as transações do usuário
    const sessionIdToUse =
      req.cookies.sessionId === 'admin-session-id'
        ? undefined
        : req.cookies.sessionId

    const transactions = await prisma.transaction.findMany({
      where: {
        sessionId: sessionIdToUse,
      },
    })

    return res.code(200).send({ transactions })
  })

  // Get a transaction by id
  app.get('/:id', async (req, res) => {
    const { id } = req.params as IGetTransactionsParams
    // Se o sessionId for igual a 'admin-session-id',
    // retorna undefined para pegar TODOS as transações,
    // caso contrário, retorna req.cookies.sessionId,
    // para retornar apenas as transações do usuário
    const sessionIdToUse =
      req.cookies.sessionId === 'admin-session-id'
        ? undefined
        : req.cookies.sessionId

    const transaction = await prisma.transaction.findFirst({
      where: {
        id,
        sessionId: sessionIdToUse,
      },
    })

    if (!transaction) {
      return res.code(404).send({ error: 'Transaction not found' })
    }

    return res.send({ transaction })
  })

  // Create a transaction
  app.post('/', async (req, res) => {
    const { amount, title, type } = req.body as ICreateTransactionBody

    const transaction = await prisma.transaction.create({
      data: {
        title,
        amount: type === 'credit' ? amount : amount * -1,
        sessionId: req.cookies.sessionId as string,
      },
    })

    return res.code(201).send({ transaction })
  })

  // Get transactions summary
  app.get('/summary', async (req, res) => {
    // Se o sessionId for igual a 'admin-session-id',
    // retorna undefined para pegar TODOS as transações,
    // caso contrário, retorna req.cookies.sessionId,
    // para retornar apenas as transações do usuário
    const sessionIdToUse =
      req.cookies.sessionId === 'admin-session-id'
        ? undefined
        : req.cookies.sessionId

    const agg = await prisma.transaction.aggregate({
      where: {
        sessionId: sessionIdToUse,
      },
      _sum: { amount: true },
    })
    const fixedBalance: number = agg._sum.amount || 0

    return res.send({ summary: { balance: fixedBalance } })
  })
}
