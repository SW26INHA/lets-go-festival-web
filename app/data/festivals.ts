export type FestivalPoint = {
  id: string;
  name: string;
  region: string;
  category: string;
  status: "진행중" | "예정" | "종료";
  lat: number;
  lng: number;
  count: number;
  imageUrl: string;
};

<<<<<<< Updated upstream
export const festivals: FestivalPoint[] = [
  {
    id: "seoul",
    name: "서울 대표 축제",
    region: "서울",
    category: "문화예술",
    status: "진행중",
    lat: 37.5665,
    lng: 126.978,
    count: 8,
=======
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
      imageUrl: primary.thumbnailImageUrl,
    };
>>>>>>> Stashed changes
  },
  {
    id: "incheon",
    name: "인천 바다 축제",
    region: "인천",
    category: "관광특산",
    status: "예정",
    lat: 37.4563,
    lng: 126.7052,
    count: 4,
  },
  {
    id: "suwon",
    name: "수원 화성 문화제",
    region: "경기",
    category: "전통역사",
    status: "진행중",
    lat: 37.2636,
    lng: 127.0286,
    count: 6,
  },
  {
    id: "gangneung",
    name: "강릉 커피 축제",
    region: "강원",
    category: "관광특산",
    status: "예정",
    lat: 37.7519,
    lng: 128.8761,
    count: 3,
  },
  {
    id: "daejeon",
    name: "대전 과학 축제",
    region: "대전",
    category: "문화예술",
    status: "진행중",
    lat: 36.3504,
    lng: 127.3845,
    count: 5,
  },
  {
    id: "jeonju",
    name: "전주 한옥 축제",
    region: "전북",
    category: "전통역사",
    status: "진행중",
    lat: 35.8242,
    lng: 127.148,
    count: 7,
  },
  {
    id: "gwangju",
    name: "광주 예술 축제",
    region: "광주",
    category: "문화예술",
    status: "종료",
    lat: 35.1595,
    lng: 126.8526,
    count: 2,
  },
  {
    id: "daegu",
    name: "대구 치맥 페스티벌",
    region: "대구",
    category: "관광특산",
    status: "예정",
    lat: 35.8714,
    lng: 128.6014,
    count: 6,
  },
  {
    id: "busan",
    name: "부산 불꽃 축제",
    region: "부산",
    category: "문화예술",
    status: "예정",
    lat: 35.1796,
    lng: 129.0756,
    count: 9,
  },
  {
    id: "jeju",
    name: "제주 들불 축제",
    region: "제주",
    category: "생태자연",
    status: "진행중",
    lat: 33.4996,
    lng: 126.5312,
    count: 4,
  },
];
