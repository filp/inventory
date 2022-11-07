import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { formatDistance } from 'date-fns';
import type { ThingWithLabelIds } from '@server/things/schema';
import { useThings } from '@lib/things/useThings';

const columnHelper = createColumnHelper<ThingWithLabelIds>();
const columns = [
  columnHelper.accessor('id', {
    cell: (info) => (
      <span className="rounded border border-faded px-1 text-xs text-gray-400">
        {info.getValue()}
      </span>
    ),
    header: 'ID',
  }),
  columnHelper.accessor('quantity', {
    cell: (info) => info.getValue(),
    header: 'Qty',
  }),
  columnHelper.accessor('name', {
    cell: (info) => info.getValue(),
    header: 'Name',
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
];

const CollectionPage = () => {
  const { things } = useThings({
    collectionId: 4,
  });

  const table = useReactTable({
    data: things || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
      <table className="table-auto border-separate border-spacing-2">
        <thead className="font-heading text-sm text-gray-700">
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
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CollectionPage;
