"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { logout } from "@/app/actions";
import AddFellowModal from "./AddFellowModal";
import type { Fellow } from "@/lib/supabase";

const MapInner = dynamic(() => import("./MapInner"), { ssr: false });

export default function MapClient({ fellows }: { fellows: Fellow[] }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="relative h-screen w-screen">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-[1000] flex items-center justify-between bg-white/90 px-4 py-3 shadow-sm backdrop-blur-sm">
        <h1 className="text-lg font-bold text-slate-900">
          GovAI Fellows Map
        </h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500">
            {fellows.length} {fellows.length === 1 ? "fellow" : "fellows"}
          </span>
          <form action={logout}>
            <button
              type="submit"
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>

      {/* Map */}
      <MapInner fellows={fellows} />

      {/* Add button */}
      <button
        onClick={() => setShowModal(true)}
        className="absolute bottom-6 right-6 z-[1000] rounded-full bg-blue-600 px-5 py-3 font-medium text-white shadow-lg hover:bg-blue-700 active:scale-95"
      >
        + Add Yourself
      </button>

      {/* Modal */}
      {showModal && <AddFellowModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
