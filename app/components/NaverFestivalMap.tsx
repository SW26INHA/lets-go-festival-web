"use client";

import Script from "next/script";
import { useEffect, useMemo, useRef, useState } from "react";
import type { FestivalPoint, FestivalStatus } from "@/app/types/festival-types";
import { festivalStatusOptions } from "@/app/constants/festival-constants";

type NaverMapInstance = {
  destroy?: () => void;
  getZoom: () => number;
  setZoom: (zoom: number) => void;
  setCenter: (latLng: unknown) => void;
};

type NaverMarkerInstance = {
  setMap: (map: NaverMapInstance | null) => void;
};

type NaverInfoWindowInstance = {
  open: (map: NaverMapInstance, marker: NaverMarkerInstance) => void;
  close: () => void;
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
  InfoWindow: new (options: Record<string, unknown>) => NaverInfoWindowInstance;
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
  focusPoint?: {
    lat: number;
    lng: number;
  } | null;
};

const naverMapKey = process.env.NEXT_PUBLIC_NAVER_MAP_NCP_KEY_ID;

function statusLabel(status: FestivalStatus) {
  return festivalStatusOptions.find((option) => option.value === status)?.label ?? status;
}

function formatDate(date: string) {
  return date.replaceAll("-", ".");
}

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
  const imageUrl = point.thumbnailImageUrl;

  if (!imageUrl) {
    return `
      <button class="naver-cluster-bubble" style="width:${size}px;height:${size}px" aria-label="${point.title}">
      </button>
    `;
  }

  return `
    <button
      class="naver-cluster-bubble naver-cluster-bubble--image"
      style="width:${size}px;height:${size}px;background-image:url('${imageUrl}');"
      aria-label="${point.title}"
    >
    </button>
  `;
}

function buildHoverCardHtml(point: FestivalPoint) {
  const imageBlock = point.thumbnailImageUrl
    ? `<img src="${point.thumbnailImageUrl}" alt="${
        point.title
      }" style="width:72px;height:72px;object-fit:cover;border-radius:14px;flex-shrink:0;" />`
    : `<div style="width:72px;height:72px;border-radius:14px;background:#e0ecff;flex-shrink:0;"></div>`;

  return `
    <div style="
      display:flex;
      align-items:center;
      gap:12px;
      min-width:260px;
      max-width:320px;
      padding:12px 14px;
      border-radius:18px;
      background:#ffffff;
      box-shadow:0 14px 30px rgba(15, 23, 42, 0.16);
      border:1px solid #dbe8ff;
    ">
      ${imageBlock}
      <div style="min-width:0;flex:1;">
        <div style="
          display:flex;
          align-items:flex-start;
          justify-content:space-between;
          gap:8px;
        ">
          <strong style="
            display:block;
            font-size:14px;
            line-height:1.35;
            color:#0f172a;
            white-space:nowrap;
            overflow:hidden;
            text-overflow:ellipsis;
          ">${point.title}</strong>
          <span style="
            flex-shrink:0;
            padding:4px 8px;
            border-radius:999px;
            background:#eff6ff;
            color:#2563eb;
            font-size:11px;
            font-weight:700;
          ">${statusLabel(point.status)}</span>
        </div>
        <p style="
          margin:6px 0 0;
          font-size:12px;
          line-height:1.5;
          color:#64748b;
          overflow:hidden;
          display:-webkit-box;
          -webkit-line-clamp:2;
          -webkit-box-orient:vertical;
        ">${point.address1}</p>
        <p style="margin:6px 0 0;font-size:12px;line-height:1.5;color:#64748b;">
          ${formatDate(point.eventStartDate)} ~ ${formatDate(point.eventEndDate)}
        </p>
        <p style="margin:2px 0 0;font-size:12px;line-height:1.5;color:#64748b;">
          ${point.telephone}
        </p>
      </div>
    </div>
  `;
}

export default function NaverFestivalMap({ points, focusPoint }: NaverFestivalMapProps) {
  const mapElementRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<NaverMapInstance | null>(null);
  const markersRef = useRef<NaverMarkerInstance[]>([]);
  const infoWindowsRef = useRef<NaverInfoWindowInstance[]>([]);
  const [scriptReady, setScriptReady] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const scriptSrc = useMemo(() => {
    if (!naverMapKey) {
      return null;
    }

    return `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${naverMapKey}`;
  }, []);

  useEffect(() => {
    if (!scriptReady || !mapElementRef.current || !window.naver?.maps || mapRef.current) {
      return;
    }

    const maps = window.naver.maps;
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

    return () => {
      map.destroy?.();
      mapRef.current = null;
    };
  }, [scriptReady]);

  useEffect(() => {
    if (!scriptReady || !mapRef.current || !window.naver?.maps) {
      return;
    }

    const maps = window.naver.maps;
    const map = mapRef.current;

    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];
    infoWindowsRef.current.forEach((infoWindow) => infoWindow.close());
    infoWindowsRef.current = [];

    markersRef.current = points.map((point) => {
      const size = getMarkerSize(point.count);
      const infoWindow = new maps.InfoWindow({
        content: buildHoverCardHtml(point),
        borderWidth: 0,
        backgroundColor: "transparent",
        disableAnchor: true,
        pixelOffset: new maps.Point(0, -8),
      });

      const marker = new maps.Marker({
        position: new maps.LatLng(point.latitude, point.longitude),
        map,
        title: point.title,
        icon: {
          content: getMarkerHtml(point),
          size: new maps.Size(size, size),
          anchor: new maps.Point(size / 2, size / 2),
        },
      });

      maps.Event.addListener(marker, "click", () => {
        const target = new maps.LatLng(point.latitude, point.longitude);

        map.setCenter(target);
        map.setZoom(14);
      });

      maps.Event.addListener(marker, "mouseover", () => {
        infoWindow.open(map, marker);
      });

      maps.Event.addListener(marker, "mouseout", () => {
        infoWindow.close();
      });

      infoWindowsRef.current.push(infoWindow);

      return marker;
    });

    return () => {
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];
      infoWindowsRef.current.forEach((infoWindow) => infoWindow.close());
      infoWindowsRef.current = [];
    };
  }, [scriptReady, points]);

  useEffect(() => {
    if (!focusPoint || !mapRef.current || !window.naver?.maps || !scriptReady) {
      return;
    }

    const maps = window.naver.maps;
    const map = mapRef.current;
    const target = new maps.LatLng(focusPoint.lat, focusPoint.lng);

    map.setCenter(target);
    map.setZoom(14);
  }, [focusPoint, scriptReady]);

  useEffect(() => {
    if (!scriptReady || !mapRef.current) {
      return;
    }

    if (!navigator.geolocation) {
      const map = mapRef.current;

      if (!map || !window.naver?.maps) {
        return;
      }

      const maps = window.naver.maps;
      const seoul = new maps.LatLng(37.5665, 126.978);

      map.setCenter(seoul);
      map.setZoom(12);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const map = mapRef.current;

        if (!map || !window.naver?.maps) {
          return;
        }

        const maps = window.naver.maps;
        const target = new maps.LatLng(
          position.coords.latitude,
          position.coords.longitude,
        );

        map.setCenter(target);
        map.setZoom(14);
      },
      () => {
        const map = mapRef.current;

        if (!map || !window.naver?.maps) {
          return;
        }

        const maps = window.naver.maps;
        const seoul = new maps.LatLng(37.5665, 126.978);

        map.setCenter(seoul);
        map.setZoom(12);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      },
    );
  }, [scriptReady]);

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
    </section>
  );
}
