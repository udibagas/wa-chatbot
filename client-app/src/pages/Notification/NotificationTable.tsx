import { ReloadOutlined } from "@ant-design/icons";
import DataTable from "../../components/DataTable";
import PageHeader from "../../components/PageHeader";
import { Input } from "antd";
import { useDataTableContext } from "../../hooks/useDataTable";
import { NotificationType } from "./Notification";
import ActionButton from "../../components/buttons/ActionButton";

export default function NotificationTable() {
  const { refreshData, setSearch, setCurrentPage, handleDelete } = useDataTableContext()

  const columns = [
    {
      title: "Time", width: 160, dataIndex: "createdAt", key: "createdAt", render: (_: string, record: NotificationType) => {
        const date = new Date(record.createdAt)
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
      }
    },
    {
      title: "Data",
      key: "data",
      render: (_: string, record: NotificationType) => {
        return <pre>{JSON.stringify(record.data, null, 2)}</pre>
      }
    },
    {
      title: <ReloadOutlined onClick={refreshData} />,
      key: "action",
      align: "center" as const,
      width: 80,
      render: (_: string, record: NotificationType) => (
        <ActionButton
          allowEdit={false}
          onDelete={() => handleDelete(record.id)}
        />
      ),
    },
  ];

  return (
    <>
      <PageHeader title="Notifications">
        <Input.Search
          placeholder="Search"
          allowClear
          onSearch={(value) => {
            setCurrentPage(1)
            setSearch(value)
          }}
          style={{ width: 200 }}
        />
      </PageHeader>

      <DataTable<NotificationType> columns={columns} />
    </>
  )
}
