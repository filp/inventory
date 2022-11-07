import { z } from 'zod';
import { publicProcedure } from '@server/trpc';
import prisma from '@server/prisma';
import { ID, Pagination } from '@lib/schema';
import { ThingWithLabelIds } from './schema';

export const getThings = publicProcedure
  .input(
    Pagination.extend({
      archived: z.boolean().default(false),
    }).default({})
  )
  .output(
    z.object({
      things: z.array(ThingWithLabelIds),
      nextCursor: ID.optional(),
    })
  )
  .query(async ({ input }) => {
    const thingsWithLabelIds = await prisma.thing.findMany({
      where: {
        archivedAt: input.archived ? { not: null } : null,
      },
      take: input.limit + 1,
      cursor: input.cursor
        ? {
            id: input.cursor,
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
      things: things.slice(0, -1),
      nextCursor: things.length > 0 ? things[things.length - 1].id : undefined,
    };
  });
