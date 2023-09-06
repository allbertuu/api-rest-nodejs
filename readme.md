# api-rest-nodejs

A REST API of transaction records developed with Node, with e2e test coverage (end-to-end) and TypeScript. Built following TDD (Test Driven Development).

## Run Locally

Clone the project

```bash
  git clone https://github.com/allbertuu/api-rest-nodejs
```

Go to the project directory

```bash
  cd api-rest-nodejs
```

Install dependencies

```bash
  npm install
```

Run Prisma Migrations (to sync the database schema)

```bash
  npm run migrate
```

[Add the environment variables](#environment-variables)

Start the server

```bash
  npm run dev
```

## Running Tests

To run tests, run the following command

```bash
  npm test
```

### Notes

To get total access to all transactions, send the following to `/signin` through the request body in JSON format:

```JSON
{
  "username": "admin"
  "password": "admin"
}
```
With that, you'll be able to access all the routes with a special cookie.

## Functional Requirements

- The user can log in;
- The user can create a transaction;
- The user can get his account summary;
- The user can view all the transactions he has created;
- The user can view a single transaction;

## Business Rules

- The transaction can be of the credit type that add to the total amount, or debit that will be subtracted;
- It must be possible to identify the user between requests;
- The user must only view transactions that he has created;

## Tech Stack

- Node
- TypeScript
- Prisma ORM
- Fastify
- Supertest
- Vitest

## Environment Variables

To run this project, you will need to add environment variables to your `.env` file.  
You can just rename the `.env.example` to `.env`, and voilá.

## Feedback 💬

If you want to give me a feedback, send me a message on [LinkedIn](https://www.linkedin.com/in/albertov-albuquerque/) 😉