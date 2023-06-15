import {
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  chakra,
  Text,
  Button,
  Flex,
  Box,
} from "@chakra-ui/react";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";

import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { api } from "~/utils/api";

function AdminPage() {
  const { data: trx } = api.admin.balconyTrx.useQuery();
  const { data: total } = api.admin.total.useQuery();
  type Trx = Exclude<typeof trx, undefined>;
  const columnHelper = createColumnHelper<Trx[number]>();
  const table = useReactTable({
    getCoreRowModel: getCoreRowModel(),
    data: trx || [],
    columns: [
      columnHelper.accessor((row) => row.from, {
        id: "from",
        cell: (info) => <span>{info.getValue()}</span>,
      }),
      columnHelper.accessor((row) => row.amount, {
        id: "amount",
        cell: (info) => <span>{info.getValue()} LNX</span>,
      }),
      columnHelper.accessor((row) => row.wallet, {
        id: "wallet",
        cell: (info) => <span>{info.getValue()}</span>,
      }),
    ],
  });

  return (
    <Box>
        <Text>Total {!!total && total} LNX</Text>
      <Table>
        <Thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <Th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
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
                return (
                  <Td key={cell.id}>
                    <Text>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </Text>
                  </Td>
                );
              })}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}

export default AdminPage;
