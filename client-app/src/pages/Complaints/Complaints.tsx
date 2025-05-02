import ComplaintTable from "./ComplaintTable";
import { DataTableProvider } from "../../providers/DataTableProvider";

export type Location = {
  latitude: number;
  longitude: number;
  name?: string;
  address?: string;
}

export type Type = "accident" | "congestion" | "extortion" | "environment" | "infrastructure" | "criminal" | "other";
export type Status = "submitted" | "in_review" | "in_progress" | "resolved" | "rejected";
export type Priority = "low" | "medium" | "high" | "critical";

export interface ComplaintType {
  id: number;
  from: string;
  type: Type;
  region: string;
  title: string;
  description: string;
  attachments: string[];
  location: Location;
  status: Status;
  priority: Priority;
  createdAt: string;
  updatedAt: string;
}

export default function User() {
  return (
    <DataTableProvider<ComplaintType> url='/api/complaints'>
      <ComplaintTable />
    </DataTableProvider>
  );
};
