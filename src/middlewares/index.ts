import { FastifyRequest, FastifyReply } from 'fastify'

async function checkIfSessionIdExists(req: FastifyRequest, res: FastifyReply) {
  const sessionId = req.cookies.sessionId

  if (!sessionId) {
    return res.code(401).send({ error: 'Unauthorized' })
  }
}

export { checkIfSessionIdExists }
