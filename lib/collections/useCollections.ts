import { trpc } from '@lib/trpc';

export const useCollections = ({ archived }: { archived?: boolean } = {}) => {
  const { data, ...query } = trpc.getCollections.useQuery({
    archived,
  });

  return {
    ...query,
    collections: data,
  };
};
