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
  const users = api.admin.users.useQuery();
  const utils = api.useContext();
  const { mutate: addFunds } = api.admin.addFunds.useMutation({ onSuccess: () => utils.admin.users.invalidate()});
  const { mutate: removeFunds } = api.admin.removeFunds.useMutation({ onSuccess: () => utils.admin.users.invalidate()});
  const { mutate: deleteUser} = api.admin.deleteUser.useMutation({ onSuccess: () => utils.admin.users.invalidate()})
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
      columnHelper.accessor((row) => row.walletId, {
        id: "walletId",
        cell: (info) => <span>{info.getValue()}</span>,
      }),
      columnHelper.accessor((row) => row.email, {
        id: "email",
        cell: (info) => <span>{info.getValue()}</span>,
      }),
      columnHelper.accessor((row) => row.balance, {
        id: "balance",
        cell: (info) => {
          return <span>{info.getValue()}</span>;
        },
      }),
      columnHelper.display({
        id: "actions",
        cell: (info) => {
          const userId = info.row.original.userId;
          const internalId = info.row.original.id;
          const add5 = () => addFunds({ userId, amount: 5 });
          const add10 = () => addFunds({ userId, amount: 10 });
          const remove5 = () => removeFunds({ userId, amount: 5})
          
          return (
            <Flex gap="5px">
              <Button variant="primary" onClick={add5}>
                Add 5
              </Button>
              <Button variant="primary" onClick={add10}>
                Add 10
              </Button>
              <Button variant="primary" onClick={remove5}>
                Reduce 5
              </Button>
              <Button onClick={() => deleteUser({ internalId })}>
                Delete User
              </Button>
            </Flex>
          );
        },
      }),
    ],
  });

  return (
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
