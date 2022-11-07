import { createArea } from './areas/createArea';
import { getArea } from './areas/getArea';
import { getAreas } from './areas/getAreas';
import { createCollection } from './collections/createCollection';
import { getCollections } from './collections/getCollections';
import { getThings } from './things/getThings';
import { getThing } from './things/getThing';
import { router } from './trpc';

export const appRouter = router({
  // Collections:
  getCollections,
  createCollection,

  // Areas:
  getArea,
  getAreas,
  createArea,

  // Things:
  getThings,
  getThing,
});

export type AppRouter = typeof appRouter;
