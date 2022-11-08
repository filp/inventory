import { trpc } from '@lib/trpc';
import type { ThingWithLabelIds } from '@server/things/schema';

export const useThing = ({ uid }: { uid: ThingWithLabelIds['uid'] }) => {
  const { data, ...query } = trpc.getThing.useQuery({
    uid: uid,
  });

  return {
    ...query,
    thing: data,
  };
};
