import Link from 'next/link';
import { Popover } from '@headlessui/react';
import { useCollections } from '@lib/collections/useCollections';
import type { Collection } from '@server/collections/schema';

export const CollectionPicker = ({
  currentCollectionId,
}: {
  currentCollectionId: Collection['id'];
}) => {
  const { collections } = useCollections();

  const currentCollection = collections
    ? collections.find((collection) => collection.id === currentCollectionId)
    : undefined;

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
        {currentCollection?.name || 'No collection selected'}
      </Popover.Button>

      <Popover.Panel className="absolute z-10 mt-1 flex flex-col gap-1 border border-faded bg-white p-2 text-sm shadow-sm">
        {filteredCollections.map((collection) => (
          <Link className="block p-2 text-black" href="" key={collection.id}>
            {collection.name}
          </Link>
        ))}
      </Popover.Panel>
    </Popover>
  );
};
