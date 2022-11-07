import { z } from 'zod';
import { publicProcedure } from '@server/trpc';
import prisma from '@server/prisma';
import { ID, Pagination, UID } from '@lib/schema';
import { ThingWithLabelIds } from './schema';

export const getThings = publicProcedure
  .input(
    Pagination.extend({
      archived: z.boolean().default(false),
      collectionId: ID,
    })
  )
  .output(
    z.object({
      things: z.array(ThingWithLabelIds),
      nextCursor: UID.optional(),
    })
  )
  .query(async ({ input }) => {
    const thingsWithLabelIds = await prisma.thing.findMany({
      where: {
        archivedAt: input.archived ? { not: null } : null,
        collectionId: input.collectionId,
      },
      take: input.limit + 1,
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
    };
  });