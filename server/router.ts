import { z } from 'zod';
import { router, publicProcedure } from './trpc';

export const appRouter = router({
  bye: publicProcedure
    .input(
      z.object({
        text: z.string().nullish(),
      })
    )
    .query(({ input }) => ({
      greeting: `hello ${input?.text ?? 'world'}`,
    })),
});

export type AppRouter = typeof appRouter;
