import { FastifyInstance } from 'fastify';
import { knex } from '../database';
import { randomUUID } from 'crypto';
import { z } from 'zod';

// criacao de plugin
export async function transactionsRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    const transactions = await knex('transactions').select();

    return { transactions };
  });

  app.get('/:id', async (req) => {
    const getTransactionParamsSchema = z.object({
      id: z.string().uuid(),
    });

    const params = getTransactionParamsSchema.parse(req.params);

    const transaction = await knex('transactions')
      .where('id', params.id)
      .first();
    return { transaction };
  });

  app.get('/summary', async () => {
    const summary = await knex('transactions')
      .sum('amount', {
        as: 'amount',
      })
      .first();

    return { summary };
  });

  app.post('/', async (request, response) => {
    const createTransactionBodySchema = z.object({
      title: z.string(), // precisa ter um campo title do tipo string
      amount: z.number(), // precisa ter um campo amount do tipo number
      type: z.enum(['credit', 'debit']),
    });

    const body = createTransactionBodySchema.parse(request.body); // valida os dados  e tbm permite tipar o req

    await knex('transactions').insert({
      id: randomUUID(),
      title: body.title,
      amount: body.type === 'credit' ? body.amount : body.amount * -1,
    });

    return response.status(201).send();
  });
}
