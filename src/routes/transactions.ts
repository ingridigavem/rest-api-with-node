import { FastifyInstance } from 'fastify';
import { knex } from '../database';
import { randomUUID } from 'crypto';
import { z } from 'zod';
import { checkSessionIdExists } from '../middlewares/check-session-id-exists';

// criação de plugin
export async function transactionsRoutes(app: FastifyInstance) {
  app.get(
    '/',
    {
      // inclusão de middleware
      preHandler: [checkSessionIdExists],
    },
    async (req) => {
      const { sessionId } = req.cookies;

      const transactions = await knex('transactions')
        .where('session_id', sessionId)
        .select();

      return { transactions };
    },
  );

  app.get(
    '/:id',
    {
      preHandler: [checkSessionIdExists],
    },
    async (req) => {
      const { sessionId } = req.cookies;

      const getTransactionParamsSchema = z.object({
        id: z.string().uuid(),
      });

      const params = getTransactionParamsSchema.parse(req.params);

      const transaction = await knex('transactions')
        .where({ id: params.id, session_id: sessionId })
        .first();
      return { transaction };
    },
  );

  app.get(
    '/summary',
    {
      preHandler: [checkSessionIdExists],
    },
    async (req) => {
      const { sessionId } = req.cookies;

      const summary = await knex('transactions')
        .where('session_id', sessionId)
        .sum('amount', {
          as: 'amount',
        })
        .first();

      return { summary };
    },
  );

  app.post('/', async (request, response) => {
    const createTransactionBodySchema = z.object({
      title: z.string(), // precisa ter um campo title do tipo string
      amount: z.number(), // precisa ter um campo amount do tipo number
      type: z.enum(['credit', 'debit']),
    });

    const body = createTransactionBodySchema.parse(request.body); // valida os dados  e tbm permite tipar o req

    // valida se ja existe cookie
    let sessionId = request.cookies.sessionId;
    // senão existir cookie cria um novo e salva no client
    if (!sessionId) {
      sessionId = randomUUID();
      response.setCookie('sessionId', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    }

    await knex('transactions').insert({
      id: randomUUID(),
      title: body.title,
      amount: body.type === 'credit' ? body.amount : body.amount * -1,
      session_id: sessionId,
    });

    return response.status(201).send();
  });
}
