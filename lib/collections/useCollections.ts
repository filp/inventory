import { trpc } from '@lib/trpc';

export const useCollections = ({
  archived,
  enabled,
}: { archived?: boolean; enabled?: boolean } = {}) => {
  const { data, ...query } = trpc.getCollections.useQuery(
    {
      archived,
    },
    {
      enabled: typeof enabled === 'undefined' ? true : enabled,
      refetchOnWindowFocus: false,
    }
  );

  return {
    ...query,
    collections: data,
  };
};
