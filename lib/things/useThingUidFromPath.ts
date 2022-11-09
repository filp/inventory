import { useRouter } from 'next/router';

export const useThingUidFromPath = () => {
  const router = useRouter();
  const { thingUid } = router.query;

  return thingUid && (thingUid as string);
};
