import React, { useState } from 'react';
import QRCode from 'react-qr-code';
import cn from 'classnames';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { formatDistance } from 'date-fns';
import type { ThingWithLabelIds } from '@server/things/schema';
import { useThings } from '@lib/things/useThings';
import { useCollectionFromPath } from '@lib/collections/useCollectionFromPath';
import { ChevronLeft } from '@components/Icons/ChevronLeft';
import { useThing } from '@lib/things/useThing';
import { Loader } from '@components/Loader';
import { ThingUID } from '@components/Things/ThingUID';
import { QuickDefinitionList } from '@components/DefinitionList';

const columnHelper = createColumnHelper<ThingWithLabelIds>();
const columns = [
  columnHelper.accessor('quantity', {
    cell: (info) => info.getValue(),
    header: 'Qty',
  }),
  columnHelper.accessor('name', {
    cell: (info) => (
      <span title={info.row.original.uid}>{info.getValue()}</span>
    ),
    header: 'Name',
  }),
  columnHelper.accessor('createdAt', {
    cell: (info) => (
      <>{formatDistance(new Date(info.getValue()), Date.now())} ago</>
    ),
    header: 'Created',
  }),
];

const ThingDetailsPane = ({
  isOpen,
  onClose,
  thingUid,
}: {
  isOpen: boolean;
  onClose: () => void;
  thingUid: string;
}) => {
  const { thing } = useThing({
    uid: thingUid,
  });

  const onClosePane = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    onClose();
  };

  const panelClass = cn(
    'fixed top-0 right-0 h-screen max-w-[85%] bg-white border-l  md:border-r shadow-sm md:relative md:ml-4 md:h-auto md:w-[30%] md:min-w-[300px] md:flex-shrink-0',
    { 'hidden md:block': !isOpen }
  );

  if (!thing) {
    return (
      <div className={cn(panelClass, 'p-4')}>
        <Loader message="Loading thing.." />
      </div>
    );
  }

  return (
    <div className={panelClass}>
      <div
        className="flex h-[70px] cursor-pointer flex-row items-center gap-2 border-b border-faded px-4 md:hidden"
        onClick={onClosePane}
      >
        <ChevronLeft /> Return to list
      </div>

      <div>
        <div className="p-4">
          <div className="flex flex-row justify-end"></div>
          <h3 className="pt-1 font-heading text-lg">{thing.name}</h3>
          <p className="text-sm text-gray-600">{thing.description}</p>

          <div className="mt-2 flex flex-col items-center gap-3 rounded-lg border border-faded bg-gray-50 p-4">
            <QRCode value={thing.uid} xlinkTitle={thing.name} size={128} />
            <ThingUID>{thing.uid}</ThingUID>
          </div>
        </div>

        <QuickDefinitionList items={thing} pruneFalsy />
      </div>
    </div>
  );
};

const CollectionPage = () => {
  const { currentCollection, hasCurrentCollection } = useCollectionFromPath();
  const [detailsPaneOpen, setDetailsPaneOpen] = useState(true);

  const { things } = useThings({
    collectionId: currentCollection?.id || -1,
    enabled: hasCurrentCollection,
  });

  const table = useReactTable({
    data: things || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
      <div className="md:flex md:flex-row">
        <div className="md:flex-1">
          <div className="py-4">
            <h2 className="font-heading text-2xl">{currentCollection?.name}</h2>
            {currentCollection?.description && (
              <p className="text-sm text-gray-500">
                {currentCollection?.description}
              </p>
            )}
          </div>
          <table className="w-full table-auto rounded border border-faded shadow-sm md:border-separate md:border-spacing-2">
            <thead className="font-heading text-xs text-gray-700">
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
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-1 py-1 align-middle text-sm md:px-2 md:text-base"
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

        <ThingDetailsPane
          isOpen={detailsPaneOpen}
          onClose={() => setDetailsPaneOpen(false)}
          thingUid="xxvXdrZRrjP5T8vBxuvm75"
        />
      </div>
    </div>
  );
};

export default CollectionPage;
