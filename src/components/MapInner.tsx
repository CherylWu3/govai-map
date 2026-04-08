"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { removeFellow } from "@/app/actions";
import type { Fellow } from "@/lib/supabase";

// Fix Leaflet default marker icon paths
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)["_getIconUrl"];
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

function formatWhatsApp(raw: string) {
  const digits = raw.replace(/\D/g, "");
  return `https://wa.me/${digits}`;
}

export default function MapInner({ fellows }: { fellows: Fellow[] }) {
  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      className="h-full w-full"
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {fellows.map((f) => (
        <Marker key={f.id} position={[f.latitude, f.longitude]}>
          <Popup minWidth={200}>
            <div className="space-y-1 text-sm">
              <p className="text-base font-semibold">{f.name}</p>
              <p className="text-slate-600">{f.city}</p>
              {f.dates && (
                <p className="text-slate-500">
                  <span className="font-medium">When:</span> {f.dates}
                </p>
              )}
              <a
                href={formatWhatsApp(f.whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-700"
              >
                WhatsApp
              </a>
              <button
                onClick={async () => {
                  if (confirm(`Remove ${f.name} from the map?`)) {
                    await removeFellow(f.id);
                  }
                }}
                className="ml-2 text-xs text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
