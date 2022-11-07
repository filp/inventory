import { useRouter } from 'next/router';
import { useCollections } from './useCollections';

export const useCollectionFromPath = () => {
  const router = useRouter();
  const currentCollectionId =
    router.query.collectionId && parseInt(router.query.collectionId as string);
  const hasCurrentCollectionId = typeof currentCollectionId !== 'undefined';

  const { collections } = useCollections({
    enabled: hasCurrentCollectionId,
  });

  const currentCollection = collections
    ? collections.find((collection) => collection.id === currentCollectionId)
    : undefined;

  const filteredCollections = collections
    ? collections.filter(
        (collection) => collection.id !== currentCollection?.id
      )
    : [];

  return {
    currentCollection,
    hasCurrentCollection: typeof currentCollection !== 'undefined',
    otherCollections: filteredCollections,
  };
};
