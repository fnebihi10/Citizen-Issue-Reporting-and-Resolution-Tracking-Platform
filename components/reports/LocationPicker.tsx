'use client';

import { CircleMarker, MapContainer, Popup, TileLayer, useMapEvents } from 'react-leaflet';

export type ReportCoordinates = {
  latitude: number;
  longitude: number;
};

const DEFAULT_CENTER: [number, number] = [42.6629, 21.1655];

function MapClickHandler({ onSelect }: { onSelect: (coordinates: ReportCoordinates) => void }) {
  useMapEvents({
    click(event) {
      onSelect({ latitude: event.latlng.lat, longitude: event.latlng.lng });
    },
  });

  return null;
}

export function LocationPicker({ value, onChange }: { value: ReportCoordinates | null; onChange: (value: ReportCoordinates) => void }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
      <div className="h-[300px] sm:h-[360px]">
        <MapContainer center={DEFAULT_CENTER} zoom={13} scrollWheelZoom className="h-full w-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler onSelect={onChange} />
          {value ? (
            <CircleMarker center={[value.latitude, value.longitude]} radius={9} pathOptions={{ color: '#047857', fillColor: '#10b981', fillOpacity: 0.85, weight: 3 }}>
              <Popup>Lokacioni i zgjedhur për raportim.</Popup>
            </CircleMarker>
          ) : null}
        </MapContainer>
      </div>
      <div className="flex items-center justify-between gap-3 border-t border-slate-200 bg-white px-4 py-3 text-xs text-slate-600">
        <span>Kliko në hartë për ta vendosur lokacionin.</span>
        {value ? <span className="font-bold text-emerald-700">Lokacioni u zgjodh</span> : <span className="font-semibold text-amber-700">Lokacioni mungon</span>}
      </div>
    </div>
  );
}
