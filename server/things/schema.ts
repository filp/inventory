import { z } from 'zod';
import { BaseResourceEntity, ID } from '@lib/schema';

export const Thing = BaseResourceEntity.omit({
  slug: true,
}).extend({
  spotId: ID,
  collectionId: ID,
  labelIds: z.array(ID),
});

export type Thing = z.infer<typeof Thing>;
