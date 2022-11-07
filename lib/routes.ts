import type { Collection } from '@server/collections/schema';

export const routes = {
  home: () => `/`,
  collection: ({ id }: { id: Collection['id'] }) => `/collections/${id}`,
};
