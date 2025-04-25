import { UserType } from "../types";
import UserTable from "../features/Users/UserTable";
import { DataTableProvider } from "../providers/DataTableProvider";

export default function User() {
  return (
    <DataTableProvider<UserType> url='/api/users'>
      <UserTable />
    </DataTableProvider>
  );
};
