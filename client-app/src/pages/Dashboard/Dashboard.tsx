import DashboardTable from "./DashboardTable";
import { DataTableProvider } from "../../providers/DataTableProvider";

export interface ComplaintType {
  id: number;
  from: string;
  type: "accident" | "congestion" | "extortion" | "environment" | "infrastructure" | "other";
  title: string;
  description: string;
  attachments: string[];
  location: {
    latitude: number;
    longitude: number;
    name?: string;
    address?: string;
  };
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
