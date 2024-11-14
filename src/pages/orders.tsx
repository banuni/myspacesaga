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
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@chakra-ui/react";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";

import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { api, type RouterOutputs } from "~/utils/api";
import { Input } from "~/components/Input";
import { useMemo, useState } from "react";

type Trx = RouterOutputs["admin"]["balconyTrx"][number];
const columnHelper = createColumnHelper<Trx>();

const useColumns = (markDone: (id: string) => void) => {
  return [
    columnHelper.accessor("doneAt", {
      header: "",
      cell: (info) => {
        const value = info.getValue();
        const fulfilled = !!value;
        if (!fulfilled) {
          return (
            <Box
              w="30px"
              h="30px"
              bgColor={"white"}
              borderRadius="full"
              onClick={() => markDone(info.row.original.trxId)}
            />
          );
        }
        return (
          <Popover trigger="click">
            <PopoverTrigger>
              <Box
                w="30px"
                h="30px"
                bgColor={fulfilled ? "grey" : "white"}
                opacity={fulfilled ? 0.5 : 1}
                borderRadius="full"
              />
            </PopoverTrigger>
            <PopoverContent>
              <Box bgColor="black" color="white">
                {value?.toISOString()}
              </Box>
            </PopoverContent>
          </Popover>
        );
      },
    }),
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
  ];
};

function Orders() {
  const [filterValue, setFilterValue] = useState<string>("");
  const { data: trx } = api.admin.balconyTrx.useQuery();
  const { data: total } = api.admin.total.useQuery();
  const utils = api.useContext();
  const { mutate: markDoneMutation } = api.admin.setOrderDone.useMutation({
    onMutate: (params) => {
      utils.admin.balconyTrx.setData(undefined, (prev) =>
        prev?.map((t) =>
          t.trxId === params.trxId ? { ...t, doneAt: new Date() } : t
        )
      );
    },
    onSettled: () => {
      void utils.admin.balconyTrx.invalidate();
    },
  });
  const markDone = (id: string) => {
    console.log("marking done", id);
    markDoneMutation({ trxId: id });
  };
  const columns = useColumns(markDone);
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
    columns,
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

export default Orders;
