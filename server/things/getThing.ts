import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { publicProcedure } from '@server/trpc';
import prisma from '@server/prisma';
import { ThingWithLabelsAndFiles } from './schema';

export const getThing = publicProcedure
  .input(
    z.object({
      uid: ThingWithLabelsAndFiles.shape.uid,
    })
  )
  .output(ThingWithLabelsAndFiles)
  .query(async ({ input }) => {
    const thing = await prisma.thing.findFirst({
      where: {
        uid: input.uid,
      },
      include: {
        files: {
          include: {
            file: true,
          },
        },
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

    const { thingLabels, files, ...thingProps } = thing;

    return {
      ...thingProps,
      labels: thingLabels.map((thingLabel) => thingLabel.label),
      files: files.map((thingFile) => thingFile.file),
    };
  });
