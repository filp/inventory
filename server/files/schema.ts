import { z } from 'zod';
import { ID } from '@server/schema';

export const File = z.object({
  id: ID,
  name: z.string(),
  mimeType: z.string(),
  uri: z.string(),
  width: z.number().nullable(),
  height: z.number().nullable(),
});

export type File = z.infer<typeof File>;
