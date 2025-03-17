"use client";

import * as React from "react";
import {
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Pagination from "./pagination";
import { Spinner } from "../loader";
export type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

export function CommonTable({
  columns,
  data,
  isLoading,
  setPage,
  page,
  setSelectedIds,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: { data: any; pagination: any };
  isLoading: boolean;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  page: number;
  setSelectedIds?: React.Dispatch<React.SetStateAction<number[]>>;
}) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const [rowSelection, setRowSelection] = React.useState({});

  const Columns = React.useMemo(() => columns, []);

  const table = useReactTable({
    data: data?.data || [],
    columns: Columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    pageCount: data?.pagination?.totalPages || 0,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getRowId: (row: any) => row.id,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  });
  React.useEffect(() => {
    if (setSelectedIds) {
      setSelectedIds(Object.keys(rowSelection).map(Number));
    }
  }, [rowSelection]);
  console.log(data?.data);

  return (
    <div className="w-full h-full ">
      <div className="flex rounded-md bg-[#ffffff]  min-h-[calc(100vh-370px)] xl:h-[calc(100vh-370px)] p-2 overflow-x-auto">
        <Table className="">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-sm md:text-lg">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody className="">
            {!isLoading ? (
              table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        style={{
                          width: cell.column.getSize(),
                          height: "50px",
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <Spinner />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {!isLoading && data?.pagination?.totalPages > 1 && (
        <Pagination
          className="bg-white border-none w-full mt-14"
          page={page}
          totalPages={data?.pagination?.totalPages}
          setPage={setPage}
        />
      )}
    </div>
  );
}
