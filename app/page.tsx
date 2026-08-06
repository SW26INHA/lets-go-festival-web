"use client";

import { useState } from "react";
import FestivalSidebar from "@/app/components/FestivalSidebar";
import NaverFestivalMap from "@/app/components/NaverFestivalMap";
import { festivals, regions } from "@/app/data/festivals";

export default function Home() {
  const [focusPoint, setFocusPoint] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  return (
    <main className="min-h-screen bg-slate-100 text-slate-800">
      <header className="flex h-11 items-center justify-between border-b border-slate-200 bg-white px-5">
        <div className="flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded bg-blue-600 text-[13px] font-bold text-white">
            ⌖
          </span>
          <h1 className="text-lg font-bold tracking-normal text-slate-900">
            전국 축제 지도
          </h1>
        </div>

        <nav className="flex items-center gap-6 text-sm font-semibold">
          <a className="flex items-center gap-1.5 text-slate-500" href="#">
            <span className="text-xs">☰</span>
            목록 보기
          </a>
        </nav>
      </header>

      <div className="grid min-h-[calc(100vh-44px)] grid-cols-[360px_minmax(0,1fr)] max-lg:grid-cols-1">
        <FestivalSidebar
          onFestivalSelect={setFocusPoint}
          popularFestivals={festivals}
          regions={regions}
        />
        <NaverFestivalMap focusPoint={focusPoint} points={festivals} />
      </div>
    </main>
  );
}
