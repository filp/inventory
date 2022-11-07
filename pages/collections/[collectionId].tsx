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
      <span className="rounded border border-faded px-1 text-xs text-gray-400">
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
    <div className="w-screen px-4">
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
      <div className="flex flex-row">
        <div className="flex-1">
          <table className="w-full table-auto border-separate border-spacing-2 rounded border border-faded shadow-sm">
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
                    <td key={cell.id} className="px-2 py-1 align-middle">
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

        <div className="mx-4 min-w-[30%] flex-shrink-0 rounded  bg-black p-4 text-white shadow-sm">
          <div className="flex flex-col gap-1">
            <h3 className="pt-1 font-heading text-lg">iPhone 13 Pro Max</h3>
            <p className="text-sm text-faded">
              Filipe&apos;s iPhone 13 Pro Max
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionPage;
