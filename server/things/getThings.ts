import { z } from 'zod';
import { publicProcedure } from '@server/trpc';
import prisma from '@server/prisma';
import { ID, UID } from '@server/schema';
import { ThingWithLabelIds } from './schema';

export const getThings = publicProcedure
  .input(
    z.object({
      cursor: UID.optional(),
      limit: z.number().max(500).min(1).default(150),
      archived: z.boolean().default(false),
      collectionId: ID,
    })
  )
  .output(
    z.object({
      things: z.array(ThingWithLabelIds),
      nextCursor: UID.optional(),
      results: z.number(),
    })
  )
  .query(async ({ input }) => {
    const take = input.limit + 1;
    const where = {
      archivedAt: input.archived ? { not: null } : null,
      collectionId: input.collectionId,
    };

    // AFAIK prisma doesn't support getting more pagination details along
    // with a cursor findMany:
    const matchingThingsCount = await prisma.thing.count({ where });

    const thingsWithLabelIds = await prisma.thing.findMany({
      where,
      take,
      cursor: input.cursor
        ? {
            uid: input.cursor,
          }
        : undefined,
      include: {
        thingLabels: {
          include: {
            label: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

    const things = thingsWithLabelIds.map((thing) => {
      const { thingLabels, ...thingProps } = thing;

      return {
        ...thingProps,
        labelIds: thingLabels.map(({ label }) => label.id),
      };
    });

    return {
      things: things.length > input.limit ? things.slice(0, -1) : things,
      nextCursor: things.length > 0 ? things[things.length - 1].uid : undefined,
      results: matchingThingsCount,
    };
  });
