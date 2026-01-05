import type { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { getDb } from './db.js';
import { sdk } from './_core/sdk.js';

/**
 * Cria o contexto tRPC para cada requisição.
 * É aqui que você injeta o que seus procedimentos precisam,
 * como o banco de dados, sessão do usuário, etc.
 */
export async function createContext({ req, res }: CreateExpressContextOptions) {
  const db = await getDb();
  // Autentica o usuário a partir do request e o anexa ao contexto
  const user = await sdk.authenticateRequest(req);

  return {
    db,
    user,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
