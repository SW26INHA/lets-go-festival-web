import {
  festivalRecords,
  festivalMonths,
  festivalStatuses,
  festivalStatusOptions,
  festivalYears,
  type FestivalRecord,
  regions,
} from "@/app/data/festival-mock";

export type FestivalPoint = {
  id: string;
  name: string;
  region: string;
  category: string;
  status: "진행중" | "예정" | "종료";
  lat: number;
  lng: number;
  count: number;
};

const regionNameMap = new Map(regions.map((region) => [region.regionIdx, region.regionName]));

const regionBuckets = festivalRecords.reduce<Map<number, FestivalRecord[]>>((buckets, festival) => {
  const current = buckets.get(festival.regionIdx) ?? [];
  current.push(festival);
  buckets.set(festival.regionIdx, current);
  return buckets;
}, new Map());

export const festivals: FestivalPoint[] = Array.from(regionBuckets.entries()).map(
  ([regionIdx, entries]) => {
    const primary = entries[0];
    const regionName = regionNameMap.get(regionIdx) ?? primary.regionName;
    const status =
      entries.some((festival) => festival.status === "ONGOING")
        ? "진행중"
        : entries.some((festival) => festival.status === "UPCOMING")
          ? "예정"
          : "종료";

    return {
      id: String(regionIdx),
      name: `${regionName} 축제`,
      region: regionName,
      category: "축제",
      status,
      lat: primary.latitude,
      lng: primary.longitude,
      count: entries.length,
    };
  },
);

export {
  regions,
  festivalYears,
  festivalMonths,
  festivalStatuses,
  festivalStatusOptions,
};
