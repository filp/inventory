import { z } from 'zod';
import { publicProcedure } from '@server/trpc';
import prisma from '@server/prisma';
import { AreaWithSpots } from './schema';

export const getAreas = publicProcedure
  .input(
    z
      .object({
        archived: z.boolean().default(false),
      })
      .default({})
  )
  .output(z.array(AreaWithSpots))
  .query(async ({ input }) =>
    prisma.area.findMany({
      where: {
        archivedAt: input.archived ? { not: null } : null,
      },
      include: {
        spots: true,
      },
    })
  );
