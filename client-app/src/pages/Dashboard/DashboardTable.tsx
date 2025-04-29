import moment from "moment";
import { CheckCircleOutlined, CloseCircleOutlined, DownloadOutlined, EyeOutlined, ReloadOutlined, ShareAltOutlined } from "@ant-design/icons";
import DataTable from "../../components/DataTable";
import PageHeader from "../../components/PageHeader";
import { Descriptions, Image, Input, Modal } from "antd";
import { useDataTableContext } from "../../hooks/useDataTable";
import { ComplaintType } from "./Dashboard";
import ActionButton from "../../components/buttons/ActionButton";

export default function UserTable() {
  const { refreshData, setSearch, setCurrentPage, handleDelete } = useDataTableContext()

  const columns = [
    { title: "ID", width: 60, dataIndex: "id", key: "id" },
    {
      title: "Time", width: 160, dataIndex: "createdAt", key: "createdAt", render: (_: string, record: ComplaintType) => {
        const date = new Date(record.createdAt)
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
      }
    },
    { title: "From", width: 150, dataIndex: "from", key: "from" },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: 100
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (_: string, record: ComplaintType) => {
        return <a onClick={(e) => {
          e.preventDefault();
          showDetail(record)
        }}>
          {record.title}
        </a>
      }
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      width: 100,
      align: "center" as const,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      align: "center" as const,
    },
    {
      title: <ReloadOutlined onClick={refreshData} />,
      key: "action",
      align: "center" as const,
      width: 80,
      render: (_: string, record: ComplaintType) => (
        <ActionButton
          allowEdit={false}
          onDelete={() => handleDelete(record.id)}
          additionalItems={
            [
              {
                key: "view",
                icon: <EyeOutlined />,
                label: 'View',
                onClick: () => showDetail(record)
              },
              {
                key: "resolve",
                icon: <CheckCircleOutlined />,
                label: 'Resolve',
                onClick: () => {
                  console.log('Resolve complaint', record);
                }
              },
              {
                key: "escalate",
                icon: <CheckCircleOutlined />,
                label: 'Escalate',
                onClick: () => {
                  console.log('Escalate complaint', record);
                }
              },
              {
                key: "download",
                icon: <DownloadOutlined />,
                label: 'Download',
                onClick: () => {
                  console.log('Download complaint', record);
                }
              },
              {
                key: "share",
                icon: <ShareAltOutlined />,
                label: 'Share',
                onClick: () => {
                  console.log('Share complaint', record);
                }
              },
            ]
          }
        />
      ),
    },
  ];

  return (
    <>
      <PageHeader title="Manage Complaints">
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

      <DataTable<ComplaintType> columns={columns} />
    </>
  )
}

function showDetail(record: ComplaintType) {
  Modal.info({
    title: "Log Details",
    closable: true,
    okText: "Close",
    okButtonProps: {
      icon: <CloseCircleOutlined />,
    },
    width: '600px',
    content: (
      <div className="mt-5">
        <Descriptions column={1} size="small" bordered>
          <Descriptions.Item label="ID">
            {record.id}
          </Descriptions.Item>

          <Descriptions.Item label="Time">
            {moment(record.createdAt).format("DD-MMM-YYYY HH:mm:ss")}
          </Descriptions.Item>

          <Descriptions.Item label="From">
            {record.from}
          </Descriptions.Item>

          <Descriptions.Item label="Type">
            {record.type}
          </Descriptions.Item>

          <Descriptions.Item label="Title">
            {record.title}
          </Descriptions.Item>

          <Descriptions.Item label="Description">
            <div dangerouslySetInnerHTML={{ __html: record.description.replace(/\n/g, '<br />') }} />          </Descriptions.Item>
          <Descriptions.Item label="Priority">
            {record.priority}
          </Descriptions.Item>

          <Descriptions.Item label="Status">
            {record.status}
          </Descriptions.Item>
        </Descriptions>

        {record.attachments.length > 0 &&
          <div className="flex gap-5 mt-5">
            {record.attachments.map((attachment, index) => {
              return (
                <div key={index} style={{ marginTop: 10 }}>
                  <Image
                    width={100}
                    height={100}
                    src={`/${attachment}`}
                    alt=""
                  />
                </div>
              )
            })}
          </div>
        }
      </div>
    ),
  })
}
