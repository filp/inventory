import { publicProcedure } from '@server/trpc';
import prisma from '@server/prisma';
import { Area } from './schema';

export const createArea = publicProcedure
  .input(
    Area.pick({
      name: true,
      description: true,
      slug: true,
    })
  )
  .output(Area)
  .mutation(async ({ input }) =>
    prisma.area.create({
      data: input,
    })
  );
