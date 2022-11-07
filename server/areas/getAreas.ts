import { z } from 'zod';
import { publicProcedure } from '@server/trpc';
import prisma from '@server/prisma';
import { Area } from './schema';

export const getAreas = publicProcedure
  .input(
    z
      .object({
        archived: z.boolean().default(false),
      })
      .default({})
  )
  .output(z.array(Area))
  .query(async ({ input }) =>
    prisma.area.findMany({
      where: {
        archivedAt: input.archived ? { not: null } : null,
      },
    })
  );
