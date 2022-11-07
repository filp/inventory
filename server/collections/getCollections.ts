import { z } from 'zod';
import { publicProcedure } from '@server/trpc';
import prisma from '@server/prisma';
import { Collection } from './schema';

export const getCollections = publicProcedure
  .input(
    z
      .object({
        archived: z.boolean().default(false),
      })
      .default({})
  )
  .output(z.array(Collection))
  .query(async ({ input }) =>
    prisma.collection.findMany({
      where: {
        archivedAt: input.archived ? { not: null } : null,
      },
    })
  );
