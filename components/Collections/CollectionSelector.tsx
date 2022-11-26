import cn from 'classnames';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { Listbox } from '@headlessui/react';
import { routes } from '@lib/routes';
import { useCollectionFromPath } from '@lib/collections/useCollectionFromPath';
import type { Collection } from '@server/collections/schema';

export const CollectionSelector = ({
  collections,
  defaultCollection,
  onPickCollection,
  name,
}: {
  collections: Collection[];
  defaultCollection?: Collection;
  onPickCollection: (collection: Collection) => void;
  name?: string;
}) => {
  const [selectedCollection, setSelectedCollection] = useState<
    Collection | undefined
  >(defaultCollection);

  return (
    <Listbox
      defaultValue={defaultCollection}
      onChange={(newCollection) => {
        if (newCollection === selectedCollection) return;

        setSelectedCollection(newCollection);
        onPickCollection(newCollection);
      }}
      name={name || 'collection'}
    >
      {({ open }) => (
        <div className="relative">
          <Listbox.Button
            className={cn(
              'focus-ring min-w-[140px] rounded border border-faded px-3 py-1 shadow-sm',
              { 'border-indigo-500': open }
            )}
          >
            {selectedCollection?.name || 'No collection selected'}
          </Listbox.Button>
          <Listbox.Options className="focus-ring absolute z-50 mt-1 min-w-[140px] rounded border border-faded bg-white shadow-sm">
            {collections.map((collection) => (
              <Listbox.Option
                key={collection.id}
                value={collection}
                className="hover:link-like px-4 py-2 ui-active:bg-indigo-100"
              >
                {collection.name}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      )}
    </Listbox>
  );
};

export const CurrentCollectionSelector = () => {
  const router = useRouter();
  const { currentCollection, otherCollections } = useCollectionFromPath();

  // If we have no active collection, don't render the component at all to
  // avoid confusing the user -- they're probably going through the wizard,
  // or managing something outside the collection scope.
  if (!currentCollection) {
    return null;
  }

  return (
    <CollectionSelector
      onPickCollection={(collection) => {
        void router.push(routes.collection({ collectionId: collection.id }));
      }}
      collections={otherCollections}
      defaultCollection={currentCollection}
    />
  );
};
