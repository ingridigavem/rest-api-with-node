import fastify from 'fastify';
import cookie from '@fastify/cookie';
import { env } from './env';
import { transactionsRoutes } from './routes/transactions';

const app = fastify();

app.register(cookie);

app.addHook('preHandler', async (req, res) => {
  console.log(`Log: [${req.method}] {${req.url}`);
});

app.register(transactionsRoutes, {
  // nome de plugin
  prefix: 'transactions', // prefixo da url pra q o plugin seja ativo
});

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('HTTP server Running! ');
  });
