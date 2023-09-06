import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '../app'
import { execSync } from 'child_process'

describe('Transactions route', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    // Reset the database before each test
    execSync('npx prisma migrate reset --force')
  })

  it('should create a new transaction', async () => {
    const res = await request(app.server)
      .post('/transactions')
      .send({
        title: 'Salário',
        amount: 3000,
        type: 'credit',
      })
      .set('Cookie', 'sessionId=admin-session-id')
      .expect(201)

    expect(res.body).toEqual({
      transaction: {
        id: expect.any(String),
        title: 'Salário',
        amount: 3000,
        sessionId: 'admin-session-id',
        createdAt: expect.any(String),
      },
    })
  })

  it('should list all transactions', async () => {
    const res = await request(app.server)
      .get('/transactions')
      .set('Cookie', 'sessionId=admin-session-id')
      .expect(200)

    expect(res.body).toEqual({ transactions: expect.any(Array) })
  })

  it('should list a specific transaction by id', async () => {
    await request(app.server)
      .post('/transactions')
      .send({
        title: 'Salário',
        amount: 3000,
        type: 'credit',
      })
      .set('Cookie', 'sessionId=admin-session-id')

    const allTransactionsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', 'sessionId=admin-session-id')

    // first entry of the array
    const transactionId = allTransactionsResponse.body.transactions[0].id

    const getSpecificTransactionResponse = await request(app.server)
      .get(`/transactions/${transactionId}`)
      .set('Cookie', 'sessionId=admin-session-id')
      .expect(200)

    expect(getSpecificTransactionResponse.body).toEqual({
      transaction: expect.objectContaining({
        title: 'Salário',
        amount: 3000,
      }),
    })
  })

  describe('Getting a session id', () => {
    it('should get as admin', async () => {
      const res = await request(app.server)
        .post('/signin')
        .send({ username: 'admin', password: 'admin' })
        .expect(200)

      const cookies = res.headers['set-cookie']

      expect(cookies).toEqual([
        expect.stringContaining('sessionId=admin-session-id'),
      ])
    })

    it('should get as an user', async () => {
      const res = await request(app.server)
        .post('/signin')
        .send({ username: 'allbertuu', password: 'almondegasloucas123' })
        .expect(200)

      const cookies = res.headers['set-cookie']

      expect(cookies).toEqual([expect.stringContaining('sessionId=')])
    })
  })

  describe('Get a summary of all transactions', () => {
    it('should get balance 0', async () => {
      const res = await request(app.server)
        .get('/transactions/summary')
        .set('Cookie', 'sessionId=admin-session-id')
        .expect(200)

      expect(res.body).toEqual({ summary: { balance: 0 } })
    })

    it('should get balance 1220', async () => {
      await request(app.server)
        .post('/transactions')
        .send({
          title: 'Salário',
          amount: 1300,
          type: 'credit',
        })
        .set('Cookie', 'sessionId=admin-session-id')
        .expect(201)

      await request(app.server)
        .post('/transactions')
        .send({
          title: 'Comida japonesa',
          amount: 80,
          type: 'debit',
        })
        .set('Cookie', 'sessionId=admin-session-id')
        .expect(201)

      const res = await request(app.server)
        .get('/transactions/summary')
        .set('Cookie', 'sessionId=admin-session-id')
        .expect(200)

      expect(res.body).toEqual({ summary: { balance: 1220 } })
    })
  })
})
