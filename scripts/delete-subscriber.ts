import 'dotenv/config';
import { createInterface } from 'node:readline/promises';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { z } from 'zod';
const prompt = createInterface({ input: process.stdin, output: process.stdout });
try {
  const email = z
    .email()
    .parse((await prompt.question('E-mail da solicitação verificada: ')).trim().toLowerCase());
  const db = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
  });
  try {
    await db.waitlistEntry.deleteMany({ where: { email } });
    console.log('Solicitação processada.');
  } finally {
    await db.$disconnect();
  }
} finally {
  prompt.close();
}
