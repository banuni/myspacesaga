import {
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  chakra,
  Text,
  Box,
  Flex,
  Spinner,
} from "@chakra-ui/react";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";

import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { api } from "~/utils/api";
import { Input } from "~/components/Input";
import { useMemo, useState } from "react";

function AdminPage() {
  const [filterValue, setFilterValue] = useState<string>("");
  const { data: trx } = api.admin.balconyTrx.useQuery();
  const { data: total } = api.admin.total.useQuery();
  type Trx = Exclude<typeof trx, undefined>;
  const columnHelper = createColumnHelper<Trx[number]>();
  const filteredData = useMemo(
    () =>
      filterValue
        ? trx?.filter(
            (t) =>
              t.fromPlayerName
                ?.toLowerCase()
                .includes(filterValue.toLowerCase()) ||
              t.fromChar?.toLowerCase().includes(filterValue.toLowerCase())
          )
        : trx,
    [trx, filterValue]
  );

  const table = useReactTable({
    getCoreRowModel: getCoreRowModel(),
    data: filteredData || [],
    columns: [
      columnHelper.accessor("fromPlayerName", {
        header: "From",
        cell: (info) => (
          <span>
            {info.getValue()}
            <Text pt="4px" fontSize="14px">
              {info.row.original.fromChar}
            </Text>
          </span>
        ),
      }),

      columnHelper.accessor("item", {
        cell: (info) => <span>{info.getValue()}</span>,
      }),
      columnHelper.accessor("amount", {
        cell: (info) => <span>{info.getValue()} LNX</span>,
      }),
      columnHelper.accessor("wallet", {
        cell: (info) => <span>{info.getValue()}</span>,
      }),
      columnHelper.accessor("timex", {
        header: "Time",
        cell: (info) => {
          const value = info.row.original.timex;
          return (
            <span>
              {value?.toLocaleTimeString("he-il")}
              <Text pt="4px" fontSize="14px">
                {value?.toLocaleDateString("he-il")}
              </Text>
            </span>
          );
        },
      }),
    ],
  });

  return (
    <Box>
      <Flex justify="space-between" alignItems="center" mr="20px">
        <Box w="300px" p="4px" mt="10px">
          <Input
            placeholder="Search player or character..."
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
          />
        </Box>
        {total ? (
          <Text>Total {total} LNX</Text>
        ) : (
          <Spinner size="md" color="white" />
        )}
      </Flex>

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
