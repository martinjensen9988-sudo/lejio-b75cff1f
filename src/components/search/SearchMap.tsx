import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { SearchVehicle } from "@/pages/Search";
import { Car, Fuel } from "lucide-react";

// Fix Leaflet default marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Custom car marker icon
const createCarIcon = (isSelected: boolean) => {
  return L.divIcon({
    className: "custom-car-marker",
    html: `
      <div style="
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: ${isSelected ? 'hsl(225, 100%, 57%)' : 'white'};
        color: ${isSelected ? 'white' : 'hsl(225, 100%, 57%)'};
        border: 2px solid hsl(225, 100%, 57%);
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        transform: ${isSelected ? 'scale(1.25)' : 'scale(1)'};
        transition: all 0.2s;
      ">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/>
          <circle cx="7" cy="17" r="2"/>
          <path d="M9 17h6"/>
          <circle cx="17" cy="17" r="2"/>
        </svg>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
  });
};

// Component to handle map center changes
function MapCenterHandler({ selectedVehicle, vehicles }: { selectedVehicle: string | null; vehicles: SearchVehicle[] }) {
  const map = useMap();

  useEffect(() => {
    if (selectedVehicle) {
      const vehicle = vehicles.find((v) => v.id === selectedVehicle);
      if (vehicle && vehicle.lat && vehicle.lng) {
        map.flyTo([vehicle.lat, vehicle.lng], 12, { duration: 0.5 });
      }
    }
  }, [selectedVehicle, vehicles, map]);

  return null;
}

interface SearchMapProps {
  vehicles: SearchVehicle[];
  selectedVehicle: string | null;
  onVehicleSelect: (id: string | null) => void;
}

function SearchMap({ vehicles, selectedVehicle, onVehicleSelect }: SearchMapProps) {
  // Center of Denmark
  const defaultCenter: [number, number] = [55.8, 10.5];
  const defaultZoom = 7;

  return (
    <MapContainer
      center={defaultCenter}
      zoom={defaultZoom}
      className="h-full w-full"
      style={{ background: "#f3f4f6" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapCenterHandler selectedVehicle={selectedVehicle} vehicles={vehicles} />
      {vehicles.map((vehicle) => {
        if (!vehicle.lat || !vehicle.lng) return null;

        return (
          <Marker
            key={vehicle.id}
            position={[vehicle.lat, vehicle.lng]}
            icon={createCarIcon(selectedVehicle === vehicle.id)}
            eventHandlers={{
              click: () => onVehicleSelect(vehicle.id),
            }}
          >
            <Popup>
              <div style={{ padding: "8px", minWidth: "180px" }}>
                {vehicle.image_url && (
                  <img
                    src={vehicle.image_url}
                    alt={`${vehicle.make} ${vehicle.model}`}
                    style={{ width: "100%", height: "80px", objectFit: "cover", borderRadius: "8px", marginBottom: "8px" }}
                  />
                )}
                <h3 style={{ fontWeight: "bold", margin: "0 0 4px 0" }}>
                  {vehicle.make} {vehicle.model}
                </h3>
                {vehicle.variant && (
                  <p style={{ fontSize: "12px", color: "#666", margin: "0 0 8px 0" }}>{vehicle.variant}</p>
                )}
                <div style={{ marginTop: "8px", paddingTop: "8px", borderTop: "1px solid #eee" }}>
                  <span style={{ fontSize: "16px", fontWeight: "bold", color: "#2962FF" }}>
                    {vehicle.daily_price?.toLocaleString("da-DK")} kr
                  </span>
                  <span style={{ fontSize: "12px", color: "#666" }}>/dag</span>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}

export default SearchMap;
