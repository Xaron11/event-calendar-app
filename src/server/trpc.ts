import { initTRPC } from '@trpc/server';
import { User } from '@clerk/nextjs/api';

export interface Context {
  user: User | null;
}

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const procedure = t.procedure;
