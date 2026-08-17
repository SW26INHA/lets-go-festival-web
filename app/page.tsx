"use client";

import { useEffect, useMemo, useState } from "react";
import FestivalSidebar from "@/app/components/FestivalSidebar";
import NaverFestivalMap from "@/app/components/NaverFestivalMap";
import type {
  ApiResponse,
  FestivalPoint,
  FestivalMapData,
  Region,
  RegionsData,
} from "@/app/types/festival-types";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_FESTIVAL_API_BASE_URL ??
  "https://lets-go-festival-backend.onrender.com";

function createApiUrl(path: string) {
  return `${apiBaseUrl.replace(/\/$/, "")}${path}`;
}

export default function Home() {
  const [regions, setRegions] = useState<Region[]>([]);
  const [mapPoints, setMapPoints] = useState<FestivalPoint[]>([]);
  const [selectedFestival, setSelectedFestival] = useState<{
    festivalIdx: string;
    nonce: number;
  } | null>(null);
  const focusPoint = useMemo(() => {
    if (!selectedFestival) {
      return null;
    }

    const targetPoint = mapPoints.find(
      (point) => String(point.festivalIdx) === selectedFestival.festivalIdx,
    );

    if (!targetPoint) {
      return null;
    }

    return {
      lat: targetPoint.latitude,
      lng: targetPoint.longitude,
    };
  }, [mapPoints, selectedFestival]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadRegions() {
      try {
        const response = await fetch(createApiUrl("/api/v1/regions"), {
          signal: controller.signal,
        });
        const payload = (await response.json()) as ApiResponse<RegionsData>;

        if (!response.ok || !payload.success) {
          throw new Error(payload.message || "시/도 목록을 불러오지 못했습니다.");
        }

        setRegions(payload.data.regions);
      } catch {
        setRegions([]);
      }
    }

    void loadRegions();

    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function loadMapPoints() {
      try {
        const response = await fetch(createApiUrl("/api/v1/festivals/map"), {
          signal: controller.signal,
        });
        const payload = (await response.json()) as ApiResponse<FestivalMapData>;

        if (!response.ok || !payload.success) {
          throw new Error(payload.message || "지도용 축제 목록을 불러오지 못했습니다.");
        }

        const nextPoints: FestivalPoint[] = payload.data.festivals.map((festival) => ({
          ...festival,
          count: 1,
        }));

        setMapPoints(nextPoints);
      } catch {
        setMapPoints([]);
      }
    }

    void loadMapPoints();

    return () => controller.abort();
  }, []);

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
      </header>

      <div className="grid min-h-[calc(100vh-44px)] grid-cols-[360px_minmax(0,1fr)] max-lg:grid-cols-1">
        <FestivalSidebar
          onFestivalSelect={(festivalIdx) => {
            setSelectedFestival({
              festivalIdx,
              nonce: Date.now(),
            });
          }}
          regions={regions}
        />
        <NaverFestivalMap focusPoint={focusPoint} points={mapPoints} />
      </div>
    </main>
  );
}
