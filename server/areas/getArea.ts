import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { publicProcedure } from '@server/trpc';
import prisma from '@server/prisma';
import { AreaWithSpots } from './schema';

export const getArea = publicProcedure
  .input(
    z.object({
      id: AreaWithSpots.shape.id,
    })
  )
  .output(AreaWithSpots)
  .query(async ({ input }) => {
    const area = await prisma.area.findFirst({
      where: {
        id: input.id,
      },
      include: {
        spots: true,
      },
    });

    if (!area) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'No Area with that ID found',
      });
    }

    return area;
  });
