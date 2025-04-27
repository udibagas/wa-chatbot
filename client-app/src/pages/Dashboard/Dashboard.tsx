import DashboardTable from "./DashboardTable";
import { DataTableProvider } from "../../providers/DataTableProvider";

export interface MessageType {
  id: number;
  createdAt: string;
  from: string;
  type: string;
  mediaUrl?: string;
  message: {
    body?: string;
    caption?: string;
  };
}

export default function User() {
  return (
    <DataTableProvider<MessageType> url='/api/messages'>
      <DashboardTable />
    </DataTableProvider>
  );
};
