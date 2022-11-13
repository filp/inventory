import React, { type ReactNode, useEffect, useMemo, useState } from 'react';
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
import type { ThingWithLabelIds } from '@server/things/schema';
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

const columnHelper = createColumnHelper<ThingWithLabelIds>();

const paneScrollClass = 'pane-open';

const Quantity = ({ children: quantity }: { children: ReactNode }) => (
  <>
    <span className="hidden text-faded md:inline">x</span> {quantity}
  </>
);

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

  const onClosePane = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    onClose();
  };

  const panelClass = cn(
    'md:pb-4 bg-white',
    'fixed h-screen top-0 right-0 md:relative overflow-y-scroll md:h-auto max-w-[85%] md:max-w-[100%]',
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
        <div className="flex flex-row justify-end"></div>
        <h3 className="pt-1 font-heading text-xl">{thing.name}</h3>
        <p className="text-sm text-gray-600">{thing.description}</p>

        <div className="mt-2 flex flex-col items-center gap-3 rounded-lg border border-faded bg-gray-50 p-4">
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
    <div className="box">
      <div
        className="fixed top-0 left-0 h-screen w-screen bg-black bg-opacity-20 backdrop-blur-sm md:hidden"
        onClick={onClosePane}
      ></div>
      <div className={panelClass} aria-modal={isOpen}>
        <div
          className="h-[70px] border-b border-faded leading-[70px] md:sr-only"
          onClick={onClosePane}
        >
          <div className="flex cursor-pointer flex-row items-center gap-2 px-4">
            <ChevronLeft /> Return to list
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
  const { currentCollection, hasCurrentCollection } = useCollectionFromPath();
  const thingUidFromPath = useThingUidFromPath();
  const { withLabelIds } = useLabels();
  const [selectedThingUid, setSelectedThingUid] = useState(thingUidFromPath);

  const { things, totalThings } = useThings({
    collectionId: currentCollection?.id || -1,
    enabled: hasCurrentCollection,
  });

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        cell: (info) => (
          <Link
            href={routes.collectionThing({
              collectionId: currentCollection!.id,
              thingUid: info.row.original.uid,
            })}
            className="cursor-pointer text-black"
            onClick={() => setSelectedThingUid(info.row.original.uid)}
            replace
            scroll={false}
          >
            {info.getValue()}
          </Link>
        ),
        header: 'Name',
      }),
      columnHelper.accessor('quantity', {
        cell: (info) => <Quantity>{info.getValue()}</Quantity>,
        header: 'Qty',
      }),
      columnHelper.accessor('labelIds', {
        cell: (info) => <LabelList labels={withLabelIds(info.getValue())} />,
        header: 'Labels',
      }),
    ],
    [withLabelIds, currentCollection]
  );

  const table = useReactTable({
    data: things || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="block h-screen w-screen grid-cols-layout px-4 pt-[70px] md:top-0 md:mt-[-70px] md:grid md:overflow-hidden md:px-6">
      <div className="box overflow-y-scroll pb-6">
        <div className="py-4">
          <h2 className="font-heading text-2xl">{currentCollection?.name}</h2>
          {currentCollection?.description && (
            <p className="text-sm text-gray-500">
              {currentCollection?.description}
            </p>
          )}
        </div>
        <div className="mb-1 rounded border border-faded bg-gray-50 px-2 py-1 text-sm">
          Showing {things?.length || 0}/{totalThings} things in this collection
        </div>
        <table className="w-full table-auto rounded border border-faded shadow-sm md:border-separate md:border-spacing-2">
          <thead className="font-heading text-xs text-gray-700 md:text-lg md:text-black">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="border-b border-faded px-2 py-1 text-left"
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
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-2 py-2 align-middle text-sm md:py-1 md:text-base"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ThingDetailsPane
        isOpen={!!selectedThingUid}
        onClose={() => setSelectedThingUid(undefined)}
        thingUid={selectedThingUid}
        currentCollectionId={currentCollection?.id}
      />
    </div>
  );
};

export default CollectionPage;
