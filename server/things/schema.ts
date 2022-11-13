import { z } from 'zod';
import { BaseResourceEntity, ID, UID } from '@server/schema';
import { Label } from '@server/labels/schema';

export const Thing = BaseResourceEntity.omit({ id: true }).extend({
  uid: UID,
  spotId: ID,
  collectionId: ID,
  quantity: z.number().min(0).default(1),
});

export type Thing = z.infer<typeof Thing>;

export const ThingWithLabelIds = Thing.extend({ labelIds: z.array(ID) });
export type ThingWithLabelIds = z.infer<typeof ThingWithLabelIds>;

export const ThingWithLabels = Thing.extend({
  labels: z.array(Label),
});
