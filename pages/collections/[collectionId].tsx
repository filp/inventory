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

const columnHelper = createColumnHelper<ThingWithLabelIds>();
const columns = [
  columnHelper.accessor('name', {
    cell: (info) => (
      <span title={info.row.original.uid}>{info.getValue()}</span>
    ),
    header: 'Name',
  }),
  columnHelper.accessor('quantity', {
    cell: (info) => info.getValue(),
    header: 'Qty',
  }),
  columnHelper.accessor('description', {
    cell: (info) => <p className="text-sm">{info.getValue() || ''}</p>,
    header: 'Description',
  }),
  columnHelper.accessor('createdAt', {
    cell: (info) => (
      <span className="text-sm">
        {formatDistance(new Date(info.getValue()), Date.now())} ago
      </span>
    ),
    header: 'Created',
  }),
];

const ThingDetailsPane = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const onClosePane = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    onClose();
  };

  const panelClass = cn(
    'fixed top-0 right-0 h-screen min-w-[85%] bg-black text-white shadow-sm md:relative md:mx-4 md:h-auto md:min-w-[30%] md:flex-shrink-0 md:rounded',
    { 'hidden md:block': !isOpen }
  );

  return (
    <div className={panelClass}>
      <div
        className="flex h-[70px] cursor-pointer flex-row items-center gap-2 border-b border-gray-600 px-4 md:hidden"
        onClick={onClosePane}
      >
        <ChevronLeft /> Return to list
      </div>

      <div className="flex flex-col gap-1 p-4">
        <h3 className="pt-1 font-heading text-lg">iPhone 13 Pro Max</h3>
        <p className="text-sm text-faded">Filipe&apos;s iPhone 13 Pro Max</p>

        <div className="mt-4 flex flex-row justify-center rounded bg-white p-4">
          <QRCode
            value={'mhvXdrZT4jP5T8vBxuvm75'}
            xlinkTitle="iPhone 13 Pro Max"
            size={128}
          />
        </div>
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
    <div className="px-6 md:w-screen">
      <div className="py-4">
        <h2 className="text-1xl font-heading">
          Things in the{' '}
          <span className="text-indigo-700">{currentCollection?.name}</span>{' '}
          collection.
        </h2>
        {currentCollection?.description && (
          <p className="text-sm text-gray-500">
            {currentCollection?.description}
          </p>
        )}
      </div>
      <div className="md:flex md:flex-row">
        <div className="md:flex-1">
          <table className="w-full table-auto border-separate rounded border border-faded shadow-sm  md:border-spacing-2">
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
                      className="overflow-hidden px-1 py-1 align-middle md:px-2"
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
        />
      </div>
    </div>
  );
};

export default CollectionPage;
