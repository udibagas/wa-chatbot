import { useQuery } from "@tanstack/react-query";
import PieChart from "../../components/PieChart";
import { axiosInstance } from "../../lib/api";
import { dictionary } from "../../types";

export default function Report() {

  const { data: byStatus } = useQuery({
    queryKey: ['report/complaints/by-status'],
    staleTime: 60 * 1000, // 1 minute
    refetchInterval: 60 * 1000, // 1 minute
    queryFn: async () => {
      const { data } = await axiosInstance.get<{ status: string, count: string }[]>('/api/report/by-status')
      return data.map((item: { status: string; count: string }) => ({
        name: dictionary[item.status as keyof typeof dictionary] + ' (' + item.count + ')',
        value: +item.count
      }))
    },

  })

  const { data: byType } = useQuery({
    queryKey: ['report/complaints/by-type'],
    staleTime: 60 * 1000, // 1 minute
    refetchInterval: 60 * 1000, // 1 minute
    queryFn: async () => {
      const { data } = await axiosInstance.get<{ type: string, count: string }[]>('/api/report/by-type')
      return data.map((item: { type: string; count: string }) => ({
        name: dictionary[item.type as keyof typeof dictionary] + ' (' + item.count + ')',
        value: +item.count
      }))
    },
  })

  const { data: byRegion } = useQuery({
    queryKey: ['report/complaints/by-region'],
    staleTime: 60 * 1000, // 1 minute
    refetchInterval: 60 * 1000, // 1 minute
    queryFn: async () => {
      const { data } = await axiosInstance.get<{ region: string, count: string }[]>('/api/report/by-region')
      return data.map((item: { region: string; count: string }) => ({
        name: item.region + ' (' + item.count + ')',
        value: +item.count
      }))
    },
  })

  const { data: byPriority } = useQuery({
    queryKey: ['report/complaints/by-priority'],
    staleTime: 60 * 1000, // 1 minute
    refetchInterval: 60 * 1000, // 1 minute
    queryFn: async () => {
      const { data } = await axiosInstance.get<{ priority: string, count: string }[]>('/api/report/by-priority')
      return data.map((item: { priority: string; count: string }) => ({
        name: dictionary[item.priority as keyof typeof dictionary] + ' (' + item.count + ')',
        value: +item.count
      }))
    },
  })

  return (
    <div className="grid grid-cols-2 gap-5">
      <PieChart title="Jumlah Aduan Berdasarkan Status" data={byStatus!} width='100%' />
      <PieChart title="Jumlah Aduan Berdasarkan Jenis Aduan" data={byType!} width='100%' />
      <PieChart title="Jumlah Aduan Berdasarkan Area" data={byRegion!} width='100%' />
      <PieChart title="Jumlah Aduan Berdasarkan Prioritas" data={byPriority!} width='100%' />
    </div>
  )
}
