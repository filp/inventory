import { trpc } from '@lib/trpc';
import type { Area } from '@server/areas/schema';

export const useArea = ({ id }: Pick<Area, 'id'>) => {
  const { data, ...query } = trpc.getArea.useQuery({
    id,
  });

  return {
    ...query,
    area: data,
  };
};
