import { app } from './app'

export const PORT = Number(process.env.SERVER_PORT)

app
  .listen({
    port: PORT,
  })
  .then(() => {
    console.log('HTTP Server Running!')
  })
