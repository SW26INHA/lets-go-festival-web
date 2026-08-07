"use client";

import Script from "next/script";
import { useEffect, useMemo, useRef, useState } from "react";
import type { FestivalPoint } from "@/app/data/festivals";

type NaverMapInstance = {
  destroy?: () => void;
  getZoom: () => number;
  setZoom: (zoom: number) => void;
  setCenter: (latLng: unknown) => void;
};

type NaverMarkerInstance = {
  setMap: (map: NaverMapInstance | null) => void;
};

type NaverMapsNamespace = {
  Event: {
    addListener: (
      target: unknown,
      eventName: string,
      listener: () => void,
    ) => unknown;
  };
  LatLng: new (lat: number, lng: number) => unknown;
  Map: new (
    element: HTMLElement,
    options: Record<string, unknown>,
  ) => NaverMapInstance;
  Marker: new (options: Record<string, unknown>) => NaverMarkerInstance;
  Point: new (x: number, y: number) => unknown;
  Size: new (width: number, height: number) => unknown;
};

declare global {
  interface Window {
    naver?: {
      maps?: NaverMapsNamespace;
    };
  }
}

type NaverFestivalMapProps = {
  points: FestivalPoint[];
};

const naverMapKey = process.env.NEXT_PUBLIC_NAVER_MAP_NCP_KEY_ID;

function getMarkerSize(count: number) {
  if (count >= 8) {
    return 72;
  }

  if (count >= 5) {
    return 62;
  }

  return 50;
}

function getMarkerHtml(point: FestivalPoint) {
  const size = getMarkerSize(point.count);

  return `
    <button class="naver-cluster-bubble" style="width:${size}px;height:${size}px" aria-label="${point.region} 축제 ${point.count}개">
      <span>${point.count}</span>
    </button>
  `;
}

export default function NaverFestivalMap({ points }: NaverFestivalMapProps) {
  const mapElementRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<NaverMapInstance | null>(null);
  const markersRef = useRef<NaverMarkerInstance[]>([]);
  const [scriptReady, setScriptReady] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const scriptSrc = useMemo(() => {
    if (!naverMapKey) {
      return null;
    }

    return `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${naverMapKey}`;
  }, []);

  const getNaverMapSuccess = (position: GeolocationPosition) => {

  }

  const getNaverMapError = (error: GeolocationPositionError) => {
    console.error("Geolocation error:", error);
  }

  useEffect(() => {
    if (!scriptReady || !mapElementRef.current || !window.naver?.maps) {
      return;
    }

    const maps = window.naver.maps;

    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    const map = new maps.Map(mapElementRef.current, {
      center: new maps.LatLng(36.45, 127.8),
      zoom: 7,
      minZoom: 6,
      maxZoom: 14,
      scaleControl: false,
      logoControl: true,
      mapDataControl: false,
      zoomControl: false,
    });

    mapRef.current = map;

    markersRef.current = points.map((point) => {
      const size = getMarkerSize(point.count);

      const marker = new maps.Marker({
        position: new maps.LatLng(point.lat, point.lng),
        map,
        title: point.name,
        icon: {
          content: getMarkerHtml(point),
          size: new maps.Size(size, size),
          anchor: new maps.Point(size / 2, size / 2),
        },
      });

      maps.Event.addListener(marker, "click", () => {
        map.setCenter(new maps.LatLng(point.lat, point.lng));
        map.setZoom(Math.max(map.getZoom(), 10));
      });

      return marker;
    });

    return () => {
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];
      map.destroy?.();
      mapRef.current = null;
    };
  }, [scriptReady, points]);

  const zoomIn = () => {
    const map = mapRef.current;

    if (!map) {
      return;
    }

    map.setZoom(map.getZoom() + 1);
  };

  const zoomOut = () => {
    const map = mapRef.current;

    if (!map) {
      return;
    }

    map.setZoom(map.getZoom() - 1);
  };

  return (
    <section className="relative min-h-[720px] overflow-hidden bg-[#d7e7e9] max-lg:min-h-[620px]">
      {scriptSrc ? (
        <Script
          id="naver-map-sdk"
          src={scriptSrc}
          strategy="afterInteractive"
          onReady={() => setScriptReady(true)}
          onError={() => setLoadError(true)}
        />
      ) : null}

      <div className="absolute inset-0 h-full w-full" ref={mapElementRef} />

      {!scriptSrc || loadError ? (
        <div className="absolute inset-0 map-canvas">
          <div className="absolute left-1/2 top-1/2 z-20 w-[min(420px,calc(100%-32px))] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white px-6 py-5 text-center shadow-xl">
            <p className="text-base font-bold text-slate-900">
              네이버 지도 키가 필요합니다
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              `.env.local`에 `NEXT_PUBLIC_NAVER_MAP_NCP_KEY_ID`를 설정하면
              이 영역에 실제 네이버 지도가 표시됩니다.
            </p>
          </div>
        </div>
      ) : null}

      <div className="absolute left-4 top-4 z-20 overflow-hidden rounded border border-slate-300 bg-white shadow-sm">
        <button
          aria-label="지도 확대"
          className="block size-10 border-b border-slate-200 text-3xl leading-none text-slate-900"
          onClick={zoomIn}
          type="button"
        >
          +
        </button>
        <button
          aria-label="지도 축소"
          className="block size-10 text-3xl leading-none text-slate-900"
          onClick={zoomOut}
          type="button"
        >
          -
        </button>
      </div>

      <div className="absolute left-1/2 top-4 z-20 flex -translate-x-1/2 overflow-hidden rounded-lg bg-white shadow-lg">
        <button className="flex h-11 items-center gap-2 border-b-2 border-blue-600 px-7 text-sm font-bold text-blue-600">
          <span className="text-lg">⌖</span>
          축제 지도
        </button>
        <button className="flex h-11 items-center gap-2 px-7 text-sm font-bold text-slate-500">
          <span className="text-lg">□</span>
          내 주변 축제
        </button>
      </div>

      <div className="absolute right-5 top-10 z-20 flex items-center gap-5 rounded-lg bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-lg">
        <label className="flex items-center gap-2">
          <input className="size-4 accent-blue-600" type="checkbox" defaultChecked />
          진행중
        </label>
        <label className="flex items-center gap-2">
          <input className="size-4 accent-blue-600" type="checkbox" defaultChecked />
          예정
        </label>
        <button className="text-xl leading-none text-slate-700">+</button>
      </div>
<<<<<<< Updated upstream

      {/*
      <div className="absolute right-5 top-36 z-20 w-64 rounded-lg bg-white p-4 shadow-lg">
        <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-3 text-sm font-bold text-slate-900">
          [축제타입]
          <button className="text-xl text-blue-600">⌖</button>
        </div>
        <div className="space-y-2 text-sm text-slate-600">
          <label className="flex items-center gap-2">
            <input className="size-4 accent-blue-600" type="checkbox" />
            문화예술
          </label>
          <label className="flex items-center gap-2">
            <input className="size-4 accent-blue-600" type="checkbox" />
            전통역사
          </label>
          <label className="flex items-center gap-2">
            <input className="size-4 accent-blue-600" type="checkbox" />
            생태자연
          </label>
        </div>
      </div>
      */}

      <div className="absolute bottom-6 left-5 z-20 rounded-lg bg-white px-5 py-4 text-sm font-bold text-slate-500 shadow-lg">
        <p className="mb-3 text-slate-600">버블 크기</p>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="size-4 rounded-full bg-blue-600" />
            1~4개
          </div>
          <div className="flex items-center gap-3">
            <span className="size-6 rounded-full bg-blue-600" />
            5~7개
          </div>
          <div className="flex items-center gap-3">
            <span className="size-8 rounded-full bg-blue-600" />
            8개 이상
          </div>
        </div>
      </div>
=======
>>>>>>> Stashed changes
    </section>
  );
}
