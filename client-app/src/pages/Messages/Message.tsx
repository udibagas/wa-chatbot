import { DataTableProvider } from "../../providers/DataTableProvider";
import MessageTable from "./MessageTable";

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

export default function Message() {
  return (
    <DataTableProvider<MessageType> url='/api/messages'>
      <MessageTable />
    </DataTableProvider>
  );
};
