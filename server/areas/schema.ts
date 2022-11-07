import { z } from 'zod';
import { BaseResourceEntity } from '@lib/schema';
import { Spot } from '@server/spots/schema';

export const Area = BaseResourceEntity.extend({});
export type Area = z.infer<typeof Area>;

export const AreaWithSpots = Area.extend({
  spots: z.array(Spot),
});

export type AreaWithSpots = z.infer<typeof AreaWithSpots>;
