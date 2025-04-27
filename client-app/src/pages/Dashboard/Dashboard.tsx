import DashboardTable from "./DashboardTable";
import { DataTableProvider } from "../../providers/DataTableProvider";

export interface MessageType {
  id: number;
  createdAt: string;
  from: string;
  type: string;
  mediaUrl?: string;
  text?: {
    body: string;
  };
  image?: {
    caption: string;
    id: string;
  }
}

export default function User() {
  return (
    <DataTableProvider<MessageType> url='/api/messages'>
      <DashboardTable />
    </DataTableProvider>
  );
};
