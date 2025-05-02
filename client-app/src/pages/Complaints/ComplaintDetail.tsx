import { Descriptions, Image, Tag } from "antd"
import moment from "moment"
import { colors, dictionary } from "../../types"
import { AimOutlined } from "@ant-design/icons";
import MapDetail from "./MapDetail";
import { useLoaderData } from "react-router";
import { ComplaintType } from "./Complaints";
import PageHeader from "../../components/PageHeader";

export default function ComplaintDetail() {
  const record: ComplaintType = useLoaderData()

  return (
    <>
      <PageHeader title="Rincian Aduan" />
      <div className="flex gap-4">
        <div>
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
        </div>
        <MapDetail data={record} />
      </div >
    </>
  )
}

