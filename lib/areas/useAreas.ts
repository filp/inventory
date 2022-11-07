import { trpc } from '@lib/trpc';

export const useAreas = ({ archived }: { archived?: boolean } = {}) => {
  const { data, ...query } = trpc.getAreas.useQuery({
    archived,
  });

  return {
    ...query,
    areas: data,
  };
};
