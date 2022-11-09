import type { Thing } from '@prisma/client';
import type { Collection } from '@server/collections/schema';

type CollectionId = { collectionId: Collection['id'] };
type ThingUid = { thingUid: Thing['uid'] };

export const routes = {
  home: () => `/`,
  collection: ({ collectionId }: CollectionId) => ({
    pathname: '/collections/[collectionId]',
    query: {
      collectionId,
    },
  }),
  collectionThing: ({ collectionId, thingUid }: CollectionId & ThingUid) => ({
    pathname: '/collections/[collectionId]',
    query: {
      collectionId,
      thingUid,
    },
  }),
};
