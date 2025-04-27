import { ReloadOutlined } from "@ant-design/icons";
import DataTable from "../../components/DataTable";
import PageHeader from "../../components/PageHeader";
import { Input, Modal } from "antd";
import { useDataTableContext } from "../../hooks/useDataTable";
import { MessageType } from "./Dashboard";
import { Image, MessageSquareTextIcon } from "lucide-react";
import { axiosInstance } from "../../lib/api";
import ActionButton from "../../components/buttons/ActionButton";

export default function UserTable() {
  const { refreshData, setSearch, setCurrentPage, handleDelete } = useDataTableContext()

  async function showImage(imageId: string) {
    // TODO: Implement the logic to show the image
    const res = await axiosInstance.get(`/api/messages/image/${imageId}`);
    const data: { url: string } = res.data;

    Modal.info({
      title: "Image",
      content: <img src={data.url} alt="Image" />,
      onOk() { },
    })
  }

  const columns = [
    {
      title: "",
      align: "center" as const,
      dataIndex: "type",
      width: 50,
      key: "type",
      render: (_: string, record: MessageType) => {
        return record.type == 'text' ? <MessageSquareTextIcon /> : <Image onClick={() => showImage(record.image?.id as string)} />
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
      key: "text",
      render: (_: string, record: MessageType) => {
        return record.type == 'text' ? record.text?.body : record.image?.caption
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
