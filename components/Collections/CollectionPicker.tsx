import Link from 'next/link';
import { Popover } from '@headlessui/react';
import { routes } from '@lib/routes';
import { useCollectionFromPath } from '@lib/collections/useCollectionFromPath';

export const CollectionPicker = () => {
  const { currentCollection, otherCollections } = useCollectionFromPath();

  // If we have no active collection, don't render the component at all to
  // avoid confusing the user -- they're probably going through the wizard,
  // or managing something outside the collection scope.
  if (!currentCollection) {
    return null;
  }

  return (
    <Popover className="relative">
      <Popover.Button
        disabled={otherCollections.length === 0}
        className="focus-ring rounded border border-faded px-3 py-1 text-sm shadow-sm"
      >
        {currentCollection?.name || 'Unknown collection'}
      </Popover.Button>

      <Popover.Panel className="absolute z-10 mt-1 flex flex-col gap-1 border border-faded bg-white p-2 text-sm shadow-sm">
        {({ close }) => (
          <>
            {otherCollections.map((collection) => (
              <Link
                className="block p-2 text-black"
                href={routes.collection({ collectionId: collection.id })}
                key={collection.id}
                onClick={() => close()}
              >
                {collection.name}
              </Link>
            ))}
          </>
        )}
      </Popover.Panel>
    </Popover>
  );
};
