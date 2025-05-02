import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { ComplaintType } from '../pages/Complaints/Complaints';
import { axiosInstance } from '../lib/api';
import { Image, Tag } from 'antd';
import { colors, dictionary } from '../types';
import { EnvironmentOutlined, WhatsAppOutlined, ClockCircleOutlined } from '@ant-design/icons';

// Fix default marker icon issues
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
//   shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
// });

const MapView = () => {
  const [markers, setMarkers] = useState<ComplaintType[]>([]);

  useEffect(() => {
    // Fetch data from the API
    const fetchData = async () => {
      try {
        const { data } = await axiosInstance.get('/api/complaints/open');
        setMarkers(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    return () => { setMarkers([]); }
  }, [])


  const position: LatLngExpression = [-6.2088, 106.8456]; // Jakarta coordinates
  const zoom = 12;

  return (
    <MapContainer center={position} zoom={zoom} style={{ height: 'calc(100vh - 160px)', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          position={[marker.location.latitude, marker.location.longitude]}
          icon={L.icon({
            iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
            shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41],
          })}
        >
          <Popup>
            <div>
              <div className='mb-2'>
                <div className='mb-2'>
                  <Tag color={colors[marker.status]}>{dictionary[marker.status]}</Tag>
                  <Tag color={colors[marker.type]}>{dictionary[marker.type]}</Tag>
                  <Tag color={colors[marker.priority]}>{dictionary[marker.priority]}</Tag>
                </div>
                <div className='font-bold'>{marker.title}</div>
              </div>

              <div className='mb-2' dangerouslySetInnerHTML={{ __html: marker.description.replace(/\n/g, '<br />') }} />

              <div className='text-sm mt-2 text-slate-500'>
                <EnvironmentOutlined className='inline-block mr-1' size={16} />
                {marker.location.name && <>
                  {marker.location.name} < br />
                  {marker.location.address && <div className='text-sm'>{marker.location.address}</div>}
                </>}
                {marker.location.latitude}, {marker.location.longitude}
              </div>
              <div className='text-slate-500'>
                <WhatsAppOutlined className='inline-block mr-1' size={16} />
                +{marker.from}
              </div>
              <div className='text-slate-500'>
                <ClockCircleOutlined className='inline-block mr-1' size={16} />
                {`${(new Date(marker.createdAt)).toLocaleDateString()} ${(new Date(marker.createdAt)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
              </div>
            </div>

            {
              marker.attachments.length > 0 &&
              <div className="flex gap-2 mt-2">
                {marker.attachments.map((attachment, index) => {
                  return (
                    <div key={index} style={{ marginTop: 10 }}>
                      <Image
                        width={80}
                        height={80}
                        src={`/${attachment}`}
                        alt=""
                      />
                    </div>
                  )
                })}
              </div>
            }
          </Popup>
        </Marker>
      ))}

    </MapContainer>
  );
};

export default MapView;