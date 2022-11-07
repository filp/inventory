import type { z } from 'zod';
import { BaseResourceEntity } from '@lib/schema';

export const Collection = BaseResourceEntity.extend({});
export type Collection = z.infer<typeof Collection>;
