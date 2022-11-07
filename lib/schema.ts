import { z } from 'zod';

export const ID = z.number();
export const UID = z.string().max(64).min(6);
export const Timestamp = z.date();

export const Name = z.string().min(3).max(255);
export const Description = z.string().default('');

export const BaseEntity = z.object({
  id: ID,
  createdAt: Timestamp,
  updatedAt: Timestamp,
  archivedAt: Timestamp.nullable(),
});

export const BaseResourceEntity = BaseEntity.extend({
  name: Name,
  description: Description,
});

export const Pagination = z.object({
  cursor: UID.optional(),
  limit: z.number().max(500).default(150),
});
