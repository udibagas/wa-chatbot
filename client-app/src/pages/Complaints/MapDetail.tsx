import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';
import { ComplaintType } from './Complaints';


export default function MapDetail({ data }: { data: ComplaintType }) {
  const position: LatLngExpression = [data.location.latitude, data.location.longitude];
  return (
    <MapContainer center={position as LatLngExpression} zoom={17} style={{ height: 600, width: 600 }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <Marker position={position} icon={L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      })}>
        <Popup>
          <div className='text-sm mt-2 text-slate-500'>
            {data.location.name && <>
              {data.location.name} < br />
              {data.location.address && <div className='text-sm'>{data.location.address}</div>}
            </>}
            {data.location.latitude}, {data.location.longitude}
          </div>
        </Popup>
      </Marker>

    </MapContainer>
  )
}