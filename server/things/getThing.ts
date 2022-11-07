import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { publicProcedure } from '@server/trpc';
import prisma from '@server/prisma';
import { ThingWithLabels } from './schema';

export const getThing = publicProcedure
  .input(
    z.object({
      id: ThingWithLabels.shape.id,
    })
  )
  .output(ThingWithLabels)
  .query(async ({ input }) => {
    const thing = await prisma.thing.findFirst({
      where: {
        id: input.id,
      },
      include: {
        thingLabels: {
          include: {
            label: true,
          },
        },
      },
    });

    if (!thing) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'No Area with that ID found',
      });
    }

    const { thingLabels, ...thingProps } = thing;

    return {
      ...thingProps,
      labels: thingLabels.map((thingLabel) => thingLabel.label),
    };
  });
