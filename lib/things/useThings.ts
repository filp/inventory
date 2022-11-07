import { trpc } from '@lib/trpc';

export const useThings = ({
  archived,
  cursor,
  limit,
  collectionId,
}: {
  collectionId: number;
  archived?: boolean;
  cursor?: number;
  limit?: number;
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
    }
  );

  return {
    ...query,
    things: data?.things,
    nextCursor: data?.nextCursor,
  };
};
