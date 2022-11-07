import { trpc } from '@lib/trpc';

export const useThings = ({
  archived,
  cursor,
  limit,
  collectionId,
  enabled,
}: {
  collectionId: number;
  archived?: boolean;
  cursor?: string;
  limit?: number;
  enabled?: boolean;
}) => {
  const { data, ...query } = trpc.getThings.useQuery(
    {
      archived,
      cursor,
      limit,
      collectionId,
    },
    {
      keepPreviousData: true,
      enabled: typeof enabled === 'undefined' ? true : enabled,
    }
  );

  return {
    ...query,
    things: data?.things,
    nextCursor: data?.nextCursor,
  };
};
