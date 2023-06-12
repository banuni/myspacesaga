import { Table, Tbody, Td, Th, Thead, Tr, chakra, Text } from "@chakra-ui/react";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";

import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { api } from "~/utils/api";

function AdminPage() {
  const users = api.admin.users.useQuery();
  type User = Exclude<typeof users.data, undefined>[number];
  const columnHelper = createColumnHelper<User>();
  const table = useReactTable({
    getCoreRowModel: getCoreRowModel(),
    data: users.data || [],
    columns: [
      columnHelper.accessor((row) => row.name, {
        id: "name",
        cell: (info) => <span>{info.getValue()}</span>,
      }),
      columnHelper.accessor((row) => row.email, {
        id: "email",
        cell: (info) => <span>{info.getValue()}</span>,
      }),
      columnHelper.accessor((row) => row.balance, {
        id: "balance",
        cell: (info) => <span>{info.getValue()}</span>,
      }),
    ],
  });

  return (
    <Table>
      <Thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <Tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              // see https://tanstack.com/table/v8/docs/api/core/column-def#meta to type this correctly
              //   const meta: any = header.column.columnDef.meta;
              return (
                <Th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  //   isNumeric={meta?.isNumeric}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}

                  <chakra.span pl="4">
                    {header.column.getIsSorted() ? (
                      header.column.getIsSorted() === "desc" ? (
                        <TriangleDownIcon aria-label="sorted descending" />
                      ) : (
                        <TriangleUpIcon aria-label="sorted ascending" />
                      )
                    ) : null}
                  </chakra.span>
                </Th>
              );
            })}
          </Tr>
        ))}
      </Thead>
      <Tbody>
        {table.getRowModel().rows.map((row) => (
          <Tr key={row.id}>
            {row.getVisibleCells().map((cell) => {
              // see https://tanstack.com/table/v8/docs/api/core/column-def#meta to type this correctly
              return (
                <Td key={cell.id}>
                  <Text>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Text>
                </Td>
              );
            })}
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}

export default AdminPage;
