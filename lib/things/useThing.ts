import { trpc } from '@lib/trpc';
import type { ThingWithLabelIds } from '@server/things/schema';

export const useThing = ({ uid }: { uid?: ThingWithLabelIds['uid'] }) => {
  const { data, ...query } = trpc.getThing.useQuery(
    {
      uid: uid!,
    },
    {
      enabled: typeof uid !== 'undefined',
    }
  );

  return {
    ...query,
    thing: data,
  };
};
