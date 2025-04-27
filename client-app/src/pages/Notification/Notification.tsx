import NotificationTable from "./NotificationTable";
import { DataTableProvider } from "../../providers/DataTableProvider";

export interface NotificationType {
  id: number;
  data: Record<string, unknown>;
  createdAt: string;
}

export default function Notification() {
  return (
    <DataTableProvider<NotificationType> url='/api/notifications'>
      <NotificationTable />
    </DataTableProvider>
  );
};
