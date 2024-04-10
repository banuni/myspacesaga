import { Box, Table, Text, Thead, Tr, Th, Td, Tbody } from "@chakra-ui/react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { Input } from "~/components/Input";
import { api } from "~/utils/api";

export default function Page() {
  const { data: topUps } = api.admin.topUps.useQuery();
  const [filterValue, setFilterValue] = useState("");
  const filteredData = useMemo(
    () =>
      filterValue
        ? topUps?.filter(
            (item) =>
              item.toChar?.includes(filterValue) ||
              item.toPlayerName?.includes(filterValue)
          )
        : topUps,
    [topUps, filterValue]
  );
  const table = useReactTable({
    data: filteredData || [],
    getCoreRowModel: getCoreRowModel(),
    columns: [
      { accessorKey: "toPlayerName", header: "Player" },
      { accessorKey: "toChar", header: "Character" },
      { accessorKey: "amount", header: "Amount" },
      {
        accessorKey: "timex",
        cell: (info) => info.renderValue<Date>().toLocaleString("he-IL"),
      },
    ],
  });

  return (
    <>
      <Box w="300px" p="4px" mt="10px">
        <Input
          placeholder="Search player or character..."
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
        />
      </Box>
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
    </>
  );
}
