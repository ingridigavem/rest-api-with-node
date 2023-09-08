import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('production'),
  DATABASE_URL: z.string(),
  PORT: z.coerce.number().default(3333),
});

// export const env = envSchema.parse(process.env); // validacao
const _env = envSchema.safeParse(process.env); // validacao porem sem disparar erro

if (_env.success === false) {
  console.error('Invalid enviroment variables!', _env.error.format());

  throw new Error('Invalid enviroment variables');
}

export const env = _env.data;
