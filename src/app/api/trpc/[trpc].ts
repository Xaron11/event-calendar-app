import * as trpcNext from '@trpc/server/adapters/next';
import { appRouter } from '../../../server/routers/_app';
import { currentUser } from '@clerk/nextjs';

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: async () => {
    const user = await currentUser();
    return {
      user: user,
    };
  },
});
