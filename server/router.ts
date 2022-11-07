import { createArea } from './areas/createArea';
import { getArea } from './areas/getArea';
import { getAreas } from './areas/getAreas';
import { getCollections } from './collections/getCollections';
import { router } from './trpc';

export const appRouter = router({
  // Collections:
  getCollections,

  // Areas:
  getArea,
  getAreas,
  createArea,
});

export type AppRouter = typeof appRouter;
