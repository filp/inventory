import { z } from 'zod';
import { BaseResourceEntity, ID } from '@lib/schema';

export const Spot = BaseResourceEntity.extend({
  areaId: ID,
  parentSpotId: ID.nullable().optional(),
});

export type Spot = z.infer<typeof Spot>;

export const SpotWithSubSpots = Spot.extend({
  subSpots: z.array(Spot),
});

export type SpotWithSubSpots = z.infer<typeof SpotWithSubSpots>;
