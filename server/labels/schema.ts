import { z } from 'zod';
import { ID } from '@lib/schema';

export const Label = z.object({
  id: ID,
  name: z.string(),
  description: z.string().optional().default(''),
  color: z.string(),
});

export type Label = z.infer<typeof Label>;
