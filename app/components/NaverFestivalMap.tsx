"use client";

import Script from "next/script";
import { useEffect, useMemo, useRef, useState } from "react";
import type { FestivalPoint } from "@/app/types/festival-types";

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

type FestivalCluster = {
  id: string;
  lat: number;
  lng: number;
  points: FestivalPoint[];
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

  if (!point.imageUrl) {
    return `
      <button class="naver-cluster-bubble" style="width:${size}px;height:${size}px" aria-label="${point.region} 축제 ${point.count}개">
      </button>
    `;
  }

  return `
    <button
      class="naver-cluster-bubble naver-cluster-bubble--image"
      style="width:${size}px;height:${size}px;background-image:url('${point.imageUrl}');"
      aria-label="${point.region} 축제 ${point.count}개"
    >
    </button>
  `;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function buildHoverCardHtml(point: FestivalPoint) {
  const imageBlock = point.imageUrl
    ? `<img src="${escapeHtml(point.imageUrl)}" alt="${escapeHtml(
        point.name,
      )}" style="width:72px;height:72px;object-fit:cover;border-radius:14px;flex-shrink:0;" />`
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
          ">${escapeHtml(point.name)}</strong>
          <span style="
            flex-shrink:0;
            padding:4px 8px;
            border-radius:999px;
            background:#eff6ff;
            color:#2563eb;
            font-size:11px;
            font-weight:700;
          ">${escapeHtml(point.status)}</span>
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
        ">${escapeHtml(point.region)} · ${escapeHtml(point.category)}</p>
      </div>
    </div>
  `;
}

function getClusterCellSize(zoom: number) {
  if (zoom <= 7) {
    return 0.42;
  }

  if (zoom <= 8) {
    return 0.24;
  }

  if (zoom <= 9) {
    return 0.12;
  }

  if (zoom <= 10) {
    return 0.05;
  }

  if (zoom <= 11) {
    return 0.02;
  }

  if (zoom <= 12) {
    return 0.008;
  }

  return 0;
}

function clusterPoints(points: FestivalPoint[], zoom: number): FestivalCluster[] {
  const cellSize = getClusterCellSize(zoom);

  if (cellSize === 0) {
    return points.map((point) => ({
      id: point.id,
      lat: point.lat,
      lng: point.lng,
      points: [point],
    }));
  }

  const buckets = new Map<string, FestivalPoint[]>();

  points.forEach((point) => {
    const latBucket = Math.round(point.lat / cellSize);
    const lngBucket = Math.round(point.lng / cellSize);
    const key = `${latBucket}:${lngBucket}`;
    const current = buckets.get(key) ?? [];

    current.push(point);
    buckets.set(key, current);
  });

  return Array.from(buckets.entries()).map(([key, bucketPoints]) => {
    const totals = bucketPoints.reduce(
      (acc, item) => ({
        lat: acc.lat + item.lat,
        lng: acc.lng + item.lng,
      }),
      { lat: 0, lng: 0 },
    );

    return {
      id: key,
      lat: totals.lat / bucketPoints.length,
      lng: totals.lng / bucketPoints.length,
      points: bucketPoints,
    };
  });
}

function getClusterHtml(cluster: FestivalCluster) {
  const size = getMarkerSize(cluster.points.length);

  return `
    <button
      class="naver-cluster-bubble"
      style="width:${size}px;height:${size}px"
      aria-label="축제 ${cluster.points.length}개 묶음"
    ></button>
  `;
}

function buildClusterHoverHtml(cluster: FestivalCluster) {
  return `
    <div style="
      min-width:300px;
      max-width:360px;
      padding:12px 12px 10px;
      border-radius:18px;
      background:#ffffff;
      box-shadow:0 14px 30px rgba(15, 23, 42, 0.16);
      border:1px solid #dbe8ff;
    ">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:10px;">
        <div>
          <strong style="display:block;font-size:14px;line-height:1.35;color:#0f172a;">
            축제 목록 ${escapeHtml(String(cluster.points.length))}개
          </strong>
          <span style="display:block;margin-top:3px;font-size:12px;color:#64748b;">
            가까운 위치의 축제를 묶어 보여줘요
          </span>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:8px;max-height:320px;overflow:auto;padding-right:2px;">
        ${cluster.points
          .map(
            (item) => `
              <div style="display:flex;align-items:center;gap:10px;padding:8px;border-radius:14px;background:#f8fbff;border:1px solid #e5eefc;">
                ${
                  item.imageUrl
                    ? `<img src="${escapeHtml(item.imageUrl)}" alt="${escapeHtml(
                        item.name,
                      )}" style="width:44px;height:44px;object-fit:cover;border-radius:12px;flex-shrink:0;" />`
                    : `<div style="width:44px;height:44px;border-radius:12px;background:#dbeafe;flex-shrink:0;"></div>`
                }
                <div style="min-width:0;flex:1;">
                  <div style="font-size:13px;font-weight:700;color:#0f172a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                    ${escapeHtml(item.name)}
                  </div>
                  <div style="margin-top:2px;font-size:11px;color:#64748b;">
                    ${escapeHtml(item.status)} · ${escapeHtml(item.region)}
                  </div>
                </div>
              </div>
            `,
          )
          .join("")}
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
    if (!scriptReady || !mapElementRef.current || !window.naver?.maps) {
      return;
    }

    const maps = window.naver.maps;

    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];
    infoWindowsRef.current.forEach((infoWindow) => infoWindow.close());
    infoWindowsRef.current = [];

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

    const renderMarkers = () => {
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];
      infoWindowsRef.current.forEach((infoWindow) => infoWindow.close());
      infoWindowsRef.current = [];

      const zoom = map.getZoom();
      const clusters = clusterPoints(points, zoom);

      markersRef.current = clusters.map((cluster) => {
        const isCluster = cluster.points.length > 1;
        const primaryPoint = cluster.points[0];
        const size = getMarkerSize(cluster.points.length);
        const infoWindow = new maps.InfoWindow({
          content: isCluster
            ? buildClusterHoverHtml(cluster)
            : buildHoverCardHtml(primaryPoint),
          borderWidth: 0,
          backgroundColor: "transparent",
          disableAnchor: true,
          pixelOffset: new maps.Point(0, -8),
        });

        const marker = new maps.Marker({
          position: new maps.LatLng(cluster.lat, cluster.lng),
          map,
          title: isCluster
            ? `${primaryPoint.region} 축제 ${cluster.points.length}개`
            : primaryPoint.name,
          icon: {
            content: isCluster ? getClusterHtml(cluster) : getMarkerHtml(primaryPoint),
            size: new maps.Size(size, size),
            anchor: new maps.Point(size / 2, size / 2),
          },
        });

        maps.Event.addListener(marker, "click", () => {
          const target = new maps.LatLng(cluster.lat, cluster.lng);
          const targetZoom = isCluster ? Math.min(zoom + 2, 14) : 14;

          map.setCenter(target);
          map.setZoom(targetZoom);
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
    };

    renderMarkers();

    maps.Event.addListener(map, "zoom_changed", renderMarkers);

    return () => {
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];
      infoWindowsRef.current.forEach((infoWindow) => infoWindow.close());
      infoWindowsRef.current = [];
      map.destroy?.();
      mapRef.current = null;
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
