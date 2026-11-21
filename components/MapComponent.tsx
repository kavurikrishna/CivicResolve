'use client';

import { useEffect, useRef } from 'react';
import type { Map as LeafletMap, Marker as LeafletMarker } from 'leaflet';
import { Complaint } from '@/lib/types';

interface MapComponentProps {
  complaints: Complaint[];
  onSelect: (complaint: Complaint | null) => void;
  selected: Complaint | null;
}

const PRIORITY_COLORS: Record<string, string> = {
  Critical: '#ef4444',
  High: '#f59e0b',
  Medium: '#3b82f6',
  Low: '#10b981',
};

export default function MapComponent({ complaints, onSelect, selected }: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<LeafletMarker[]>([]);

  useEffect(() => {
    if (!mapRef.current) return;

    import('leaflet').then((L) => {
      // Fix default Leaflet icon paths in Next.js bundler
      const proto = L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown };
      delete proto._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });

      if (!mapInstanceRef.current) {
        mapInstanceRef.current = L.map(mapRef.current!, {
          center: [13.04, 80.22],
          zoom: 12,
          zoomControl: true,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19,
        }).addTo(mapInstanceRef.current);
      }

      // Clear existing markers
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      // Add pins matching template
      complaints.forEach((complaint) => {
        if (!complaint.lat || !complaint.lng) return;

        const color = PRIORITY_COLORS[complaint.priority] || '#3b82f6';

        // Pin design matching bottom-left screen in mockup
        const markerHtml = `
          <div style="
            width: 28px;
            height: 28px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            background: ${color};
            border: 2px solid white;
            box-shadow: 0 4px 10px rgba(0,0,0,0.25);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
          ">
            <div style="
              width: 8px;
              height: 8px;
              border-radius: 50%;
              background: white;
            "></div>
          </div>
        `;

        const icon = L.divIcon({
          html: markerHtml,
          className: '',
          iconSize: [28, 28],
          iconAnchor: [14, 28],
        });

        if (!mapInstanceRef.current) return;

        const marker = L.marker([complaint.lat, complaint.lng], { icon })
          .addTo(mapInstanceRef.current)
          .on('click', () => onSelect(complaint));

        markersRef.current.push(marker);
      });
    });
  }, [complaints, onSelect]);

  return (
    <div
      ref={mapRef}
      role="region"
      aria-label="Interactive city infrastructure map"
      className="w-full h-full min-h-[460px] rounded-2xl"
      style={{ zIndex: 0 }}
    />
  );
}
