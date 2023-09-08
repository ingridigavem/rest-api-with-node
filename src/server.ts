import fastify from 'fastify';
import { env } from './env';
import { transactionsRoutes } from './routes/transactions';

const app = fastify();

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
