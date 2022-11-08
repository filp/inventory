import { z } from 'zod';
import { publicProcedure } from '@server/trpc';
import prisma from '@server/prisma';
import { Label } from './schema';

export const getLabels = publicProcedure
  .output(z.array(Label))
  .query(async () => prisma.label.findMany());
