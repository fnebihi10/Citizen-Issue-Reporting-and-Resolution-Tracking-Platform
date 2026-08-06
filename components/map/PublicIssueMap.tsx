'use client';

import { Layers3, MapPin } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import {
  Circle,
  CircleMarker,
  MapContainer,
  Popup,
  TileLayer,
  useMap,
} from 'react-leaflet';
import { aggregatePublicDensity } from '@/lib/reports/publicTransparency';
import type { PublicReport } from '@/types/database';

const DEFAULT_CENTER: [number, number] = [42.6629, 21.1655];

function FitMapToReports({ reports }: { reports: PublicReport[] }) {
  const map = useMap();

  useEffect(() => {
    if (reports.length === 0) return;
    const points = reports.map(
      (report) => [report.latitude, report.longitude] as [number, number],
    );
    if (points.length === 1) {
      const [firstPoint] = points;
      if (firstPoint) map.setView(firstPoint, 14);
    } else {
      map.fitBounds(points, { padding: [32, 32], maxZoom: 14 });
    }
  }, [map, reports]);

  return null;
}

function densityColor(intensity: number) {
  if (intensity >= 0.75) return '#be123c';
  if (intensity >= 0.45) return '#ea580c';
  if (intensity >= 0.2) return '#ca8a04';
  return '#2563eb';
}

export default function PublicIssueMap({
  reports,
  compact = false,
}: {
  reports: PublicReport[];
  compact?: boolean;
}) {
  const [mode, setMode] = useState<'reports' | 'density'>('reports');
  const density = useMemo(() => aggregatePublicDensity(reports), [reports]);

  return (
    <div
      className={[
        'relative z-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm',
        compact ? 'h-[320px] sm:h-[380px]' : 'h-[440px] sm:h-[600px]',
      ].join(' ')}
    >
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={13}
        scrollWheelZoom
        className="h-full w-full"
      >
        <FitMapToReports reports={reports} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {mode === 'reports'
          ? reports.map((report) => (
              <CircleMarker
                key={report.id}
                center={[report.latitude, report.longitude]}
                radius={8}
                pathOptions={{
                  color: '#0757ba',
                  fillColor: '#0b63ce',
                  fillOpacity: 0.78,
                  weight: 3,
                }}
              >
                <Popup>
                  <div className="min-w-48 space-y-2 text-slate-900">
                    <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-blue-700">
                      #{report.report_number} · {report.category_name}
                    </p>
                    <p className="font-bold">{report.title}</p>
                    <p className="text-xs leading-5 text-slate-600">
                      Lokacion i përgjithësuar për privatësi publike.
                    </p>
                    <a
                      href={`/reports/${report.id}`}
                      className="inline-flex min-h-10 items-center font-bold text-blue-700 hover:text-blue-900"
                    >
                      Hape raportimin
                    </a>
                  </div>
                </Popup>
              </CircleMarker>
            ))
          : density.map((cell) => (
              <Circle
                key={cell.id}
                center={[cell.latitude, cell.longitude]}
                radius={Math.min(1050, 360 + cell.count * 95)}
                pathOptions={{
                  color: densityColor(cell.intensity),
                  fillColor: densityColor(cell.intensity),
                  fillOpacity: 0.2 + cell.intensity * 0.42,
                  opacity: 0.5 + cell.intensity * 0.35,
                  weight: 2,
                }}
              >
                <Popup>
                  <div className="min-w-40 text-slate-900">
                    <p className="font-bold">
                      {cell.count} {cell.count === 1 ? 'raportim' : 'raportime'}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-600">
                      Dendësi e llogaritur vetëm nga lokacione të
                      përgjithësuara.
                    </p>
                  </div>
                </Popup>
              </Circle>
            ))}
      </MapContainer>

      {!compact ? (
        <div
          className="absolute left-3 top-3 z-[500] flex rounded-xl border border-slate-200 bg-white p-1 shadow-lg sm:left-4 sm:top-4"
          role="group"
          aria-label="Mënyra e paraqitjes së hartës"
        >
          <button
            type="button"
            onClick={() => setMode('reports')}
            aria-pressed={mode === 'reports'}
            className={[
              'inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-xs font-bold transition-colors',
              mode === 'reports'
                ? 'bg-slate-950 text-white'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950',
            ].join(' ')}
          >
            <MapPin className="h-4 w-4" aria-hidden="true" />
            Pikat
          </button>
          <button
            type="button"
            onClick={() => setMode('density')}
            aria-pressed={mode === 'density'}
            className={[
              'inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-xs font-bold transition-colors',
              mode === 'density'
                ? 'bg-slate-950 text-white'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950',
            ].join(' ')}
          >
            <Layers3 className="h-4 w-4" aria-hidden="true" />
            Dendësia
          </button>
        </div>
      ) : null}

      <div className="pointer-events-none absolute bottom-4 left-4 z-[500] rounded-xl border border-white/70 bg-white/90 px-3 py-2 text-xs font-semibold text-slate-700 shadow-lg backdrop-blur-sm">
        {mode === 'reports'
          ? `${reports.length} raportime publike`
          : `${density.length} zona të agreguara`}
      </div>
    </div>
  );
}
