import { z } from 'zod';
import { BaseResourceEntity, ID } from '@lib/schema';

export const Thing = BaseResourceEntity.omit({
  slug: true,
}).extend({
  spotId: ID,
  collectionId: ID,
  quantity: z.number().min(0).default(1),
});

export type Thing = z.infer<typeof Thing>;

export const ThingWithLabelIds = Thing.extend({ labelIds: z.array(ID) });
export type ThingWithLabelIds = z.infer<typeof ThingWithLabelIds>;

export const ThingWithLabels = Thing.extend({
  labels: z.array(
    z.object({
      id: ID,
      name: z.string(),
      description: z.string().nullable().optional(),
      color: z.string(),
    })
  ),
});
