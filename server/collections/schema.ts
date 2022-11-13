import type { z } from 'zod';
import { BaseResourceEntity } from '@server/schema';

export const Collection = BaseResourceEntity.extend({});

export type Collection = z.infer<typeof Collection>;
