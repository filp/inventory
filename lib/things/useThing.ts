import { trpc } from '@lib/trpc';
import type { ThingWithLabelIds } from '@server/things/schema';

export const useThing = ({ id }: { id: ThingWithLabelIds['id'] }) => {
  const { data, ...query } = trpc.getThing.useQuery({
    id: id,
  });

  return {
    ...query,
    thing: data,
  };
};
