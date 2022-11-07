import { trpc } from '@lib/trpc';

export const useThings = ({
  archived,
  cursor,
  limit,
}: { archived?: boolean; cursor?: number; limit?: number } = {}) => {
  const { data, ...query } = trpc.getThings.useQuery(
    {
      archived,
      cursor,
      limit,
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
