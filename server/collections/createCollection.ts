import { publicProcedure } from '@server/trpc';
import prisma from '@server/prisma';
import { Collection } from './schema';

export const createCollection = publicProcedure
  .input(
    Collection.pick({
      name: true,
      slug: true,
    })
  )
  .output(Collection)
  .mutation(async ({ input }) =>
    prisma.collection.create({
      data: input,
    })
  );
