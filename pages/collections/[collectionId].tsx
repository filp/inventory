import React, { type ReactNode, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import QRCode from 'react-qr-code';
import Link from 'next/link';
import cn from 'classnames';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { formatRelative } from 'date-fns';
import type { Thing, ThingWithLabelIds } from '@server/things/schema';
import { useThings } from '@lib/things/useThings';
import { useCollectionFromPath } from '@lib/collections/useCollectionFromPath';
import { ChevronLeft } from '@components/Icons/ChevronLeft';
import { useThing } from '@lib/things/useThing';
import { Loader } from '@components/Loader';
import { ThingUID } from '@components/Things/ThingUID';
import { DefinitionList, DefinitionRow } from '@components/DefinitionList';
import { useLabels } from '@lib/labels/useLabels';
import { LabelList } from '@components/Label';
import { useAreas } from '@lib/areas/useAreas';
import { ArrowLongRight } from '@components/Icons/ArrowLongRight';
import { ChatBubble } from '@components/Icons/ChatBubble';
import { routes } from '@lib/routes';
import { useThingUidFromPath } from '@lib/things/useThingUidFromPath';
import { IconButton } from '@components/Button';
import type { File } from '@server/files/schema';
import { isImageFile } from '@lib/files/isImageFile';

const columnHelper = createColumnHelper<ThingWithLabelIds>();
const paneScrollClass = 'pane-open';

const Quantity = ({
  children: quantity,
  small,
}: {
  children: ReactNode;
  small?: boolean;
}) => (
  <span
    className={cn(
      'quantity whitespace-nowrap rounded border border-faded px-1 align-baseline shadow-sm',
      {
        'text-xs': small,
      }
    )}
  >
    {quantity}
  </span>
);

const FileGallery = ({ files }: { files: File[] }) => {
  if (!files.length) {
    return null;
  }

  const previewImage = files.find((file) => isImageFile(file.mimeType));

  return (
    <div className="w-full">
      {previewImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={routes.media({ fileId: previewImage.id })}
          alt=""
          className="max-h-[220px] w-full rounded border border-gray-400 object-cover shadow-sm"
        />
      )}
    </div>
  );
};

const ThingDetailsPane = ({
  isOpen,
  onClose,
  thingUid,
  currentCollectionId,
}: {
  isOpen: boolean;
  onClose: () => void;
  thingUid?: string;
  currentCollectionId?: number;
}) => {
  const { thing } = useThing({
    uid: thingUid,
  });

  const { getSpot } = useAreas();
  const location = thing && getSpot(thing.spotId);

  useEffect(() => {
    const body = document.getElementsByTagName('body')[0];

    if (isOpen) {
      body.classList.toggle(paneScrollClass, isOpen);
    }

    return () => body.classList.remove(paneScrollClass);
  }, [isOpen]);

  const panelClass = cn(
    'md:pb-4 bg-white',
    'fixed h-screen top-0 right-0 md:relative overflow-y-scroll md:overflow-y-auto md:h-auto w-[85%] md:w-full',
    { 'invisible md:visible': !isOpen }
  );

  if (!thingUid) {
    return (
      <div className={cn(panelClass, 'p-4')}>
        <p className="my-20 flex flex-col items-center gap-4 text-center text-sm text-gray-600">
          <ChatBubble />
          Select a thing on the left to see its details
        </p>
      </div>
    );
  }

  const thingPanelContent = thing ? (
    <div>
      {currentCollectionId && currentCollectionId !== thing.collectionId ? (
        <div className="bg-black p-4 text-sm">
          <Link
            href={routes.collectionThing({
              collectionId: thing.collectionId,
              thingUid: thing.uid,
            })}
            className="text-white"
          >
            Go to this thing&apos;s collection
          </Link>
        </div>
      ) : null}
      <div className="p-4">
        <h3 className="pt-1 font-heading text-xl">{thing.name}</h3>
        <p className="max-w-prose pt-2 text-sm text-gray-600">
          {thing.description}
        </p>

        <div className="mt-2 flex flex-col items-center gap-3 rounded-lg border border-faded bg-gray-50 p-4">
          <FileGallery files={thing.files} />

          <QRCode value={thing.uid} xlinkTitle={thing.name} size={128} />
          <ThingUID>{thing.uid}</ThingUID>
        </div>
      </div>

      <DefinitionList>
        <DefinitionRow label="Quantity">
          <Quantity>{thing.quantity}</Quantity>
        </DefinitionRow>
        <DefinitionRow label="Labels">
          <LabelList labels={thing.labels} />
        </DefinitionRow>
        <DefinitionRow label="Where">
          {location ? (
            <ul>
              <li>{location.area.name}</li>
              <li className="flex flex-row items-center gap-2">
                <span className="text-indigo-500">
                  <ArrowLongRight />
                </span>{' '}
                {location.spot.name}
              </li>
            </ul>
          ) : (
            <Loader message="Loading location..." />
          )}
        </DefinitionRow>
        <DefinitionRow label="Created">
          {formatRelative(new Date(thing.createdAt), Date.now())}
        </DefinitionRow>
        <DefinitionRow label="Last updated">
          {formatRelative(new Date(thing.updatedAt), Date.now())}
        </DefinitionRow>
      </DefinitionList>
    </div>
  ) : null;

  return (
    <div className="box md:overflow-y-scroll">
      <div
        className="fixed top-0 left-0 h-screen w-screen bg-black bg-opacity-20 backdrop-blur-sm md:hidden"
        onClick={onClose}
      ></div>
      <div className={panelClass}>
        <div
          className="h-[var(--header-height)] border-b border-faded leading-[var(--header-height)] md:sr-only"
          onClick={onClose}
        >
          <div className="flex cursor-pointer flex-row items-center gap-2 px-4">
            <IconButton icon={<ChevronLeft />} onPress={onClose} /> Return to
            list
          </div>
        </div>

        {thing ? (
          thingPanelContent
        ) : (
          <div className="p-2">
            <Loader message="Loading thing.." />
          </div>
        )}
      </div>
    </div>
  );
};

const CollectionPage = () => {
  const router = useRouter();
  const thingUidFromPath = useThingUidFromPath();
  const { currentCollection, hasCurrentCollection } = useCollectionFromPath();
  const { withLabelIds } = useLabels();
  const [selectedThingUid, setSelectedThingUid] = useState(thingUidFromPath);

  const isSelectedThing = (thing: Thing) => thing.uid === selectedThingUid;
  const onSelectThing = (thing?: Thing) => {
    setSelectedThingUid(thing?.uid);

    if (!selectedThingUid) return;

    void router.replace(
      routes.collectionThing({
        collectionId: currentCollection!.id,
        thingUid: selectedThingUid,
      }),
      undefined,
      {
        shallow: true,
      }
    );
  };

  const { things, totalThings } = useThings({
    collectionId: currentCollection?.id || -1,
    enabled: hasCurrentCollection,
  });

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        cell: (info) => (
          <span>
            {info.getValue()}{' '}
            <Quantity small>{info.row.original.quantity}</Quantity>
          </span>
        ),
        header: 'Name',
      }),
      columnHelper.accessor('labelIds', {
        cell: (info) => <LabelList labels={withLabelIds(info.getValue())} />,
        header: 'Labels',
      }),
    ],
    [withLabelIds]
  );

  const table = useReactTable({
    data: things || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="page-content block h-screen w-screen grid-cols-layout pt-[var(--header-height)] md:top-0 md:-mt-[var(--header-height)] md:grid md:overflow-hidden">
      <div className="box overflow-y-scroll pb-6">
        <div className="py-4">
          <h2 className="font-heading text-2xl">{currentCollection?.name}</h2>
          {currentCollection?.description && (
            <p className="max-w-prose pt-2 text-sm text-gray-500">
              {currentCollection?.description}
            </p>
          )}
        </div>
        <div className="md:pr-6">
          <div className="mb-1 rounded border border-faded bg-gray-50 px-2 py-1 text-sm">
            Showing {things?.length || 0}/{totalThings} things in this
            collection
          </div>
          <table className="w-full table-auto">
            <thead className="text-gray-700 md:text-black">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="border border-faded bg-gray-100 p-1 text-left text-sm font-normal"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="rounded odd:bg-gray-100 md:odd:bg-transparent"
                  onClick={() => onSelectThing(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className={cn('overflow-hidden border border-faded p-1', {
                        'bg-indigo-50': isSelectedThing(cell.row.original),
                      })}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ThingDetailsPane
        isOpen={!!selectedThingUid}
        onClose={() => {
          onSelectThing(undefined);
        }}
        thingUid={selectedThingUid}
        currentCollectionId={currentCollection?.id}
      />
    </div>
  );
};

export default CollectionPage;
