import Link from 'next/link';
import { useRouter } from 'next/router';
import { Popover } from '@headlessui/react';
import { useCollections } from '@lib/collections/useCollections';
import { routes } from '@lib/routes';

export const CollectionPicker = () => {
  const router = useRouter();
  const currentCollectionId =
    router.query.collectionId && parseInt(router.query.collectionId as string);

  const hasCurrentCollectionId = typeof currentCollectionId !== 'undefined';

  const { collections } = useCollections({
    enabled: hasCurrentCollectionId,
  });

  // If we have no active collection, don't render the component at all to
  // avoid confusing the user -- they're probably going through the wizard,
  // or managing something outside the collection scope.
  if (!hasCurrentCollectionId) {
    return null;
  }

  const currentCollection = collections
    ? collections.find((collection) => collection.id === currentCollectionId)
    : undefined;

  // Do not include the currently selected collection on the list:
  const filteredCollections = collections
    ? collections.filter(
        (collection) => collection.id !== currentCollection?.id
      )
    : [];

  return (
    <Popover className="relative">
      <Popover.Button
        disabled={filteredCollections.length === 0}
        className="focus-ring rounded border border-faded px-3 py-1 text-sm shadow-sm"
      >
        {currentCollection?.name || 'Unknown collection'}
      </Popover.Button>

      <Popover.Panel className="absolute z-10 mt-1 flex flex-col gap-1 border border-faded bg-white p-2 text-sm shadow-sm">
        {filteredCollections.map((collection) => (
          <Link
            className="block p-2 text-black"
            href={routes.collection({ id: collection.id })}
            key={collection.id}
          >
            {collection.name}
          </Link>
        ))}
      </Popover.Panel>
    </Popover>
  );
};
