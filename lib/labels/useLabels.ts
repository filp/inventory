import { trpc } from '@lib/trpc';

export const useLabels = () => {
  const { data, ...query } = trpc.getLabels.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  return {
    ...query,
    labels: data,

    withLabelIds: (ids: number[]) =>
      data ? data.filter((label) => ids.includes(label.id)) : [],
  };
};
