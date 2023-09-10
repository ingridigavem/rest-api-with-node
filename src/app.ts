import fastify from 'fastify';
import cookie from '@fastify/cookie';

import { transactionsRoutes } from './routes/transactions';

export const app = fastify();

app.register(cookie);

app.addHook('preHandler', async (req) => {
  console.log(`Log: [${req.method}] {${req.url}`);
});

app.register(transactionsRoutes, {
  // nome de plugin
  prefix: 'transactions', // prefixo da url pra q o plugin seja ativo
});
