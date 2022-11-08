import { useMemo } from 'react';
import type { Area } from '@server/areas/schema';
import type { Spot } from '@server/spots/schema';
import { trpc } from '@lib/trpc';

export const useAreas = ({ archived }: { archived?: boolean } = {}) => {
  const { data, ...query } = trpc.getAreas.useQuery(
    {
      archived,
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  const spotLookupTable = useMemo(() => {
    if (!data) return {};

    return data.reduce((prev, curr) => {
      curr.spots.forEach((spot) => {
        prev[spot.id] = {
          area: curr,
          spot,
        };
      });

      return prev;
    }, {} as { [spotId: number]: { area: Area; spot: Spot } });
  }, [data]);

  return {
    ...query,
    areas: data,

    getSpot: (spotId: number) =>
      spotLookupTable[spotId] || {
        area: null,
        spot: null,
      },
  };
};
