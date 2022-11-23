import shortUUID from 'short-uuid';
import { z } from 'zod';
import { publicProcedure } from '@server/trpc';
import prisma from '@server/prisma';
import { ID } from '@server/schema';
import { Thing } from './schema';

export const createThing = publicProcedure
  .input(
    Thing.pick({
      name: true,
      description: true,
      quantity: true,
      collectionId: true,
      spotId: true,
    }).extend({
      fileIds: z.array(ID),
    })
  )
  .output(Thing)
  .mutation(async ({ input }) => {
    const { fileIds, ...thingData } = input;

    const { thing } = await prisma.$transaction(async () => {
      const thing = await prisma.thing.create({
        data: {
          ...thingData,
          uid: shortUUID.generate(),
        },
      });

      const thingFile = await prisma.thingFile.createMany({
        data: fileIds.map((fileId) => ({
          thingId: thing.id,
          fileId,
        })),
      });

      return { thingFile, thing };
    });

    return thing;
  });
