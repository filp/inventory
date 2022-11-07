import QRCode from 'react-qr-code';
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
    cell: (info) => info.getValue(),
    header: 'Name',
  }),
  columnHelper.accessor('quantity', {
    cell: (info) => info.getValue(),
    header: 'Qty',
  }),
  columnHelper.accessor('description', {
    cell: (info) => info.getValue() || '',
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
  columnHelper.accessor('uid', {
    cell: (info) => (
      <span className="break-all border-faded text-xs text-gray-400 md:break-normal md:rounded md:border md:px-1">
        {info.getValue()}
      </span>
    ),
    header: 'UID',
  }),
];

const CollectionPage = () => {
  const { currentCollection, hasCurrentCollection } = useCollectionFromPath();

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
    <div className="px-4 md:w-screen">
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
          <table className="table-auto border-separate rounded border border-faded shadow-sm md:w-full md:border-spacing-2">
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
                      className="px-1 py-1 align-middle md:px-2"
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

        <div className="fixed top-0 right-0 h-screen min-w-[85%] bg-black text-white shadow-sm md:relative md:mx-4 md:h-auto  md:min-w-[30%] md:flex-shrink-0 md:rounded">
          <div className="flex h-[70px] flex-row items-center gap-2 border-b border-gray-600 px-4 md:hidden">
            <ChevronLeft /> Return to list
          </div>
          <div className="flex flex-col gap-1 p-4">
            <h3 className="pt-1 font-heading text-lg">iPhone 13 Pro Max</h3>
            <p className="text-sm text-faded">
              Filipe&apos;s iPhone 13 Pro Max
            </p>
            <div className="mt-4 flex flex-row justify-center rounded bg-white p-4">
              <QRCode
                value={'mhvXdrZT4jP5T8vBxuvm75'}
                xlinkTitle="iPhone 13 Pro Max"
                size={128}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionPage;
