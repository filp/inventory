import type { z } from 'zod';
import { BaseResourceEntity, ID } from '@server/schema';

export const Spot = BaseResourceEntity.extend({
  areaId: ID,
});

export type Spot = z.infer<typeof Spot>;
