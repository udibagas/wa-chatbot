import moment from "moment";
import { AimOutlined, CheckCircleOutlined, CloseCircleOutlined, FileSearchOutlined, ReloadOutlined } from "@ant-design/icons";
import DataTable from "../../components/DataTable";
import PageHeader from "../../components/PageHeader";
import { Descriptions, Dropdown, Image, Input, MenuProps, Modal, Tag } from "antd";
import { useDataTableContext } from "../../hooks/useDataTable";
import { ComplaintType, Priority, Status } from "./Complaints";
import ActionButton from "../../components/buttons/ActionButton";
import { axiosInstance } from "../../lib/api";
import { colors, dictionary } from "../../types";

export default function ComplaintTable() {
  const { refreshData, setSearch, setCurrentPage, handleDelete } = useDataTableContext()

  function updateStatus(id: number, status: Status) {
    Modal.confirm({
      title: 'Konfirmasi',
      content: 'Anda yakin akan mengubah status aduan?',
      okText: 'Ya',
      cancelText: 'Tidak',
      onOk: () => {
        axiosInstance.put(`/api/complaints/${id}`, { status }).then(() => {
          refreshData();
        });
      },
    })
  }

  function updatePriority(id: number, priority: Priority) {
    Modal.confirm({
      title: 'Konfirmasi',
      content: 'Anda yakin akan mengubah status aduan?',
      okText: 'Ya',
      cancelText: 'Tidak',
      onOk: () => {
        axiosInstance.put(`/api/complaints/${id}`, { priority }).then(() => {
          refreshData();
        });
      },
    })
  }

  const columns = [
    { title: "ID", width: 60, dataIndex: "id", key: "id" },
    {
      title: "Waktu", width: 160, dataIndex: "createdAt", key: "createdAt", render: (_: string, record: ComplaintType) => {
        const date = new Date(record.createdAt)
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
      }
    },
    { title: "Pengadu", width: 150, dataIndex: "from", key: "from" },
    {
      title: "Jenis Aduan",
      dataIndex: "type",
      key: "type",
      width: 150,
      align: "center" as const,
      render: (_: string, record: ComplaintType) => {
        const color = colors[record.type as keyof typeof colors]
        return <Tag color={color}>{dictionary[record.type]}</Tag>
      }
    },
    { title: "Area", width: 150, dataIndex: "region", key: "region" },
    {
      title: "Judul Aduan",
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
      title: "Lokasi",
      dataIndex: "location",
      key: "location",
      render: (_: string, record: ComplaintType) => (
        <a href={`https://www.google.com/maps?q=${record.location.latitude},${record.location.longitude}`} target="_blank">
          {record.location.name && record.location.name + ', '}
          {record.location.address && record.location.address + ', '}
          Lat: {record.location.latitude}, Long: {record.location.longitude}
        </a>
      )

    },
    {
      title: "Prioritas",
      dataIndex: "priority",
      key: "priority",
      width: 100,
      align: "center" as const,
      render: (_: string, record: ComplaintType) => {
        const color = colors[record.priority as keyof typeof colors]
        const menuItems: MenuProps['items'] = []
        const priorities: Priority[] = ['low', 'medium', 'high', 'critical']
        priorities.forEach((priority: Priority) => {
          if (record.priority !== priority) {
            menuItems!.push({
              key: priority,
              label: dictionary[priority as keyof typeof dictionary],
              onClick: () => updatePriority(record.id, priority)
            })
          }
        })

        return (
          <Dropdown menu={{ items: menuItems }} placement="bottom" arrow>
            <Tag color={color}>{dictionary[record.priority]}</Tag>
          </Dropdown>
        )
      }
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      align: "center" as const,
      render: (_: string, record: ComplaintType) => {
        const color = colors[record.status as keyof typeof colors]
        const menuItems: MenuProps['items'] = []

        if (record.status === 'submitted') {
          menuItems.push({ key: "in_review", label: dictionary.in_review, onClick: () => updateStatus(record.id, 'in_review') })
        } else if (record.status === 'in_review') {
          menuItems.push({ key: "in_progress", label: dictionary.in_progress, onClick: () => updateStatus(record.id, 'in_progress') })
        } else if (record.status === 'in_progress') {
          menuItems.push({ key: "resolved", label: dictionary.resolved, onClick: () => updateStatus(record.id, 'resolved') })
        }

        return (
          <Dropdown menu={{ items: menuItems }} placement="bottom" arrow>
            <Tag color={color}>{dictionary[record.status]}</Tag>
          </Dropdown>
        )
      }
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
                icon: <FileSearchOutlined />,
                label: 'Lihat Rician',
                onClick: () => showDetail(record)
              },
              {
                key: "resolve",
                icon: <CheckCircleOutlined />,
                label: 'Selesaikan',
                onClick: () => {
                  console.log('Resolve complaint', record);
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
      <PageHeader title="Kelola Aduan">
        <Input.Search
          placeholder="Cari"
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
    title: "Rincian Aduan",
    centered: true,
    maskClosable: true,
    keyboard: true,
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

          <Descriptions.Item label="Waktu">
            {moment(record.createdAt).format("DD-MMM-YYYY HH:mm:ss")}
          </Descriptions.Item>

          <Descriptions.Item label="Pengadu">
            {record.from}
          </Descriptions.Item>

          <Descriptions.Item label="Jenis Aduan">
            <Tag color={colors[record.type as keyof typeof colors]}>
              {dictionary[record.type]}
            </Tag>
          </Descriptions.Item>

          <Descriptions.Item label="Area">
            {record.region}
          </Descriptions.Item>

          <Descriptions.Item label="Judul Aduan">
            {record.title}
          </Descriptions.Item>

          <Descriptions.Item label="Rincian Aduan">
            <div dangerouslySetInnerHTML={{ __html: record.description.replace(/\n/g, '<br />') }} />
          </Descriptions.Item>

          <Descriptions.Item label="Lokasi">
            {record.location.name && record.location.name + ', '}
            {record.location.address && record.location.address + ', '}
            Lat: {record.location.latitude}, Long: {record.location.longitude}
            <br />
            <a className="py-1 px-3 border border-blue-500 rounded-md mt-2 inline-block" href={`https://www.google.com/maps?q=${record.location.latitude},${record.location.longitude}`} target="_blank">
              <AimOutlined className="mr-2" />
              Lihat di Google Maps
            </a>
          </Descriptions.Item>

          <Descriptions.Item label="Prioritas">
            <Tag color={colors[record.priority as keyof typeof colors]}>
              {dictionary[record.priority]}
            </Tag>
          </Descriptions.Item>

          <Descriptions.Item label="Status">
            <Tag color={colors[record.status as keyof typeof colors]}>
              {dictionary[record.status]}
            </Tag>
          </Descriptions.Item>
        </Descriptions>

        {
          record.attachments.length > 0 &&
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
      </div >
    ),
  })
}
