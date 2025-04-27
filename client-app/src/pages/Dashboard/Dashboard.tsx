import DashboardTable from "./DashboardTable";
import { DataTableProvider } from "../../providers/DataTableProvider";

export interface ComplaintType {
  id: number;
  from: string;
  type: string;
  title: string;
  description: string;
  attachments: string[];
  location: object;
  status: "submitted" | "in_review" | "in_progress" | "resolved" | "rejected";
  priority: "low" | "medium" | "high" | "critical";
  createdAt: string;
  updatedAt: string;
}

export default function User() {
  return (
    <DataTableProvider<ComplaintType> url='/api/complaints'>
      <DashboardTable />
    </DataTableProvider>
  );
};
