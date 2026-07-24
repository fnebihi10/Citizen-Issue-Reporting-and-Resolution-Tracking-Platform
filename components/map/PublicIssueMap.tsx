'use client';

import { CircleMarker, MapContainer, Popup, TileLayer } from 'react-leaflet';
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import type { PublicReport } from '@/types/database';

const DEFAULT_CENTER: [number, number] = [42.6629, 21.1655];

function FitMapToReports({ reports }: { reports: PublicReport[] }) {
  const map = useMap();

  useEffect(() => {
    if (reports.length === 0) return;
    const points = reports.map((report) => [report.latitude, report.longitude] as [number, number]);
    if (points.length === 1) {
      const [firstPoint] = points;
      if (firstPoint) map.setView(firstPoint, 14);
    } else {
      map.fitBounds(points, { padding: [32, 32], maxZoom: 14 });
    }
  }, [map, reports]);

  return null;
}

export default function PublicIssueMap({ reports }: { reports: PublicReport[] }) {
  return (
    <div className="relative z-0 h-[420px] overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm sm:h-[560px]">
      <MapContainer center={DEFAULT_CENTER} zoom={13} scrollWheelZoom className="h-full w-full">
        <FitMapToReports reports={reports} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {reports.map((report) => (
          <CircleMarker
            key={report.id}
            center={[report.latitude, report.longitude]}
            radius={8}
            pathOptions={{ color: '#0757ba', fillColor: '#0b63ce', fillOpacity: 0.78, weight: 3 }}
          >
            <Popup>
              <div className="min-w-44 space-y-2 text-slate-900">
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-blue-700">#{report.report_number} · {report.category_name}</p>
                <p className="font-bold">{report.title}</p>
                <p className="text-xs leading-5 text-slate-600">Lokacioni është përshtatur për privatësi publike.</p>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
      <div className="pointer-events-none absolute bottom-4 left-4 rounded-xl border border-white/70 bg-white/90 px-3 py-2 text-xs font-semibold text-slate-700 shadow-lg backdrop-blur-sm">
        {reports.length} raportime publike
      </div>
    </div>
  );
}
