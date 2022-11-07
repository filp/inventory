import { z } from 'zod';

export const ID = z.number();
export const Timestamp = z.date();

export const Name = z.string().min(3).max(255);
export const Description = z.string().default('');
export const Slug = z
  .string()
  .max(255)
  .min(3)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const BaseEntity = z.object({
  id: ID,
  createdAt: Timestamp,
  updatedAt: Timestamp,
  archivedAt: Timestamp.nullable(),
});

export const BaseResourceEntity = BaseEntity.extend({
  name: Name,
  description: Description,
  slug: Slug,
});
