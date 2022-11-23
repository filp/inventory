import { createArea } from './areas/createArea';
import { getAreas } from './areas/getAreas';
import { createCollection } from './collections/createCollection';
import { getCollections } from './collections/getCollections';
import { getThings } from './things/getThings';
import { getThing } from './things/getThing';
import { createThing } from './things/createThing';
import { router } from './trpc';
import { getLabels } from './labels/getLabels';

export const appRouter = router({
  // Collections:
  getCollections,
  createCollection,

  // Areas:
  getAreas,
  createArea,

  // Things:
  getThings,
  getThing,
  createThing,

  // Labels
  getLabels,
});

export type AppRouter = typeof appRouter;
