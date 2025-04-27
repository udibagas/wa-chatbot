import { ReloadOutlined } from "@ant-design/icons";
import DataTable from "../../components/DataTable";
import PageHeader from "../../components/PageHeader";
import { Image, Input } from "antd";
import { useDataTableContext } from "../../hooks/useDataTable";
import { MessageType } from "./Dashboard";
import ActionButton from "../../components/buttons/ActionButton";

export default function UserTable() {
  const { refreshData, setSearch, setCurrentPage, handleDelete } = useDataTableContext()

  const columns = [
    {
      title: "Image",
      align: "center" as const,
      dataIndex: "type",
      width: 150,
      key: "type",
      render: (_: string, record: MessageType) => {
        return record.type == 'image' ? <Image width={100} height={100} src={`/${record.mediaUrl}`} alt="" /> : ''
      },
    },
    {
      title: "Time", width: 160, dataIndex: "createdAt", key: "createdAt", render: (_: string, record: MessageType) => {
        const date = new Date(record.createdAt)
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
      }
    },
    { title: "From", width: 150, dataIndex: "from", key: "from" },
    {
      title: "Message",
      key: "message",
      render: (_: string, record: MessageType) => {
        return record.type == 'text' ? record.message.body : record.message.caption
      }
    },
    {
      title: <ReloadOutlined onClick={refreshData} />,
      key: "action",
      align: "center" as const,
      width: 80,
      render: (_: string, record: MessageType) => (
        <ActionButton
          allowEdit={false}
          onDelete={() => handleDelete(record.id)}
        />
      ),
    },
  ];

  return (
    <>
      <PageHeader title="Manage Report">
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

      <DataTable<MessageType> columns={columns} />
    </>
  )
}
