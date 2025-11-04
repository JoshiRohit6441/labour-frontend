
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';

interface MapProps {
  center: LatLngExpression;
  zoom: number;
  marker?: {
    position: LatLngExpression;
    popupContent?: string;
  };
}

const Map = ({ center, zoom, marker }: MapProps) => {
  return (
    <MapContainer center={center} zoom={zoom} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {marker && (
        <Marker position={marker.position}>
          {marker.popupContent && <Popup>{marker.popupContent}</Popup>}
        </Marker>
      )}
    </MapContainer>
  );
};

export default Map;
