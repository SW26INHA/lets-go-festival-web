export type ApiResponse<T> = {
  success: boolean;
  code: string;
  message: string;
  data: T;
};

export type Region = {
  regionIdx: number;
  regionName: string;
};

export type FestivalStatus = "ONGOING" | "UPCOMING" | "ENDED";

export type FestivalRecord = {
  festivalId: number;
  regionIdx: number;
  regionName: string;
  title: string;
  thumbnailImageUrl: string;
  originalImageUrl: string;
  latitude: number;
  longitude: number;
  address1: string;
  address2: string;
  eventStartDate: string;
  eventEndDate: string;
  telephone: string;
  status: FestivalStatus;
  keyword: string;
};

export type FestivalMapItem = Pick<
  FestivalRecord,
  "festivalId" | "thumbnailImageUrl" | "latitude" | "longitude"
>;

export type FestivalListItem = Pick<
  FestivalRecord,
  | "festivalId"
  | "title"
  | "originalImageUrl"
  | "address1"
  | "address2"
  | "eventStartDate"
  | "eventEndDate"
  | "telephone"
  | "status"
  | "latitude"
  | "longitude"
>;

export type FestivalListFilters = {
  regionIdx?: number;
  year?: number;
  month?: number;
  statuses?: FestivalStatus[];
  keyword?: string;
  page?: number;
  size?: number;
};

export type FestivalListData = {
  festivals: FestivalListItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
};

export type FestivalMapData = {
  festivals: FestivalMapItem[];
};

export type RegionsData = {
  regions: Region[];
};

export const regions: Region[] = [
  { regionIdx: 11, regionName: "서울특별시" },
  { regionIdx: 21, regionName: "부산광역시" },
  { regionIdx: 22, regionName: "대구광역시" },
  { regionIdx: 23, regionName: "인천광역시" },
  { regionIdx: 24, regionName: "광주광역시" },
  { regionIdx: 25, regionName: "대전광역시" },
  { regionIdx: 26, regionName: "울산광역시" },
  { regionIdx: 31, regionName: "경기도" },
  { regionIdx: 32, regionName: "강원특별자치도" },
  { regionIdx: 33, regionName: "충청북도" },
  { regionIdx: 34, regionName: "충청남도" },
  { regionIdx: 35, regionName: "전라북도" },
  { regionIdx: 36, regionName: "전라남도" },
  { regionIdx: 37, regionName: "경상북도" },
  { regionIdx: 38, regionName: "경상남도" },
  { regionIdx: 39, regionName: "제주특별자치도" },
];

export const festivalYears = [2024, 2025, 2026];
export const festivalMonths = Array.from({ length: 12 }, (_, index) => index + 1);
export const festivalStatuses: FestivalStatus[] = [
  "ONGOING",
  "UPCOMING",
  "ENDED",
];

export const festivalStatusOptions = [
  { value: "ONGOING" as const, label: "진행중" },
  { value: "UPCOMING" as const, label: "예정" },
  { value: "ENDED" as const, label: "종료" },
];

export const festivalRecords: FestivalRecord[] = [
  {
    festivalId: 1,
    regionIdx: 11,
    regionName: "서울특별시",
    title: "가을빛 한강 축제",
    thumbnailImageUrl:
      "https://tong.visitkorea.or.kr/cms/resource/91/3484791_image3_1.jpg",
    originalImageUrl:
      "https://tong.visitkorea.or.kr/cms/resource/91/3484791_image2_1.jpg",
    latitude: 37.4965,
    longitude: 127.1107693087,
    address1: "서울특별시 송파구 올림픽로 25",
    address2: "잠실한강공원",
    eventStartDate: "2026-08-09",
    eventEndDate: "2026-08-11",
    telephone: "02-3435-0286",
    status: "UPCOMING",
    keyword: "한강",
  },
  {
    festivalId: 2,
    regionIdx: 11,
    regionName: "서울특별시",
    title: "서울 거리예술 축제",
    thumbnailImageUrl:
      "https://tong.visitkorea.or.kr/cms/resource/91/3484791_image3_2.jpg",
    originalImageUrl:
      "https://tong.visitkorea.or.kr/cms/resource/91/3484791_image2_2.jpg",
    latitude: 37.5665,
    longitude: 126.978,
    address1: "서울특별시 중구 세종대로 110",
    address2: "서울광장",
    eventStartDate: "2026-08-15",
    eventEndDate: "2026-08-18",
    telephone: "02-120",
    status: "ONGOING",
    keyword: "예술",
  },
  {
    festivalId: 3,
    regionIdx: 31,
    regionName: "경기도",
    title: "가을 꽃 축제",
    thumbnailImageUrl:
      "https://tong.visitkorea.or.kr/cms/resource/91/3484791_image3_3.jpg",
    originalImageUrl:
      "https://tong.visitkorea.or.kr/cms/resource/91/3484791_image2_3.jpg",
    latitude: 37.2636,
    longitude: 127.0286,
    address1: "경기도 수원시 팔달구 정조로 825",
    address2: "수원화성 일원",
    eventStartDate: "2026-09-01",
    eventEndDate: "2026-09-05",
    telephone: "031-228-3080",
    status: "UPCOMING",
    keyword: "꽃",
  },
  {
    festivalId: 4,
    regionIdx: 32,
    regionName: "강원특별자치도",
    title: "강릉 커피 축제",
    thumbnailImageUrl:
      "https://tong.visitkorea.or.kr/cms/resource/91/3484791_image3_4.jpg",
    originalImageUrl:
      "https://tong.visitkorea.or.kr/cms/resource/91/3484791_image2_4.jpg",
    latitude: 37.7519,
    longitude: 128.8761,
    address1: "강원특별자치도 강릉시 창해로 17",
    address2: "안목해변 일원",
    eventStartDate: "2026-08-20",
    eventEndDate: "2026-08-24",
    telephone: "033-640-5331",
    status: "ONGOING",
    keyword: "커피",
  },
  {
    festivalId: 5,
    regionIdx: 25,
    regionName: "대전광역시",
    title: "대전 과학 축제",
    thumbnailImageUrl:
      "https://tong.visitkorea.or.kr/cms/resource/91/3484791_image3_5.jpg",
    originalImageUrl:
      "https://tong.visitkorea.or.kr/cms/resource/91/3484791_image2_5.jpg",
    latitude: 36.3504,
    longitude: 127.3845,
    address1: "대전광역시 유성구 대학로 99",
    address2: "엑스포과학공원",
    eventStartDate: "2026-08-30",
    eventEndDate: "2026-09-02",
    telephone: "042-270-0431",
    status: "UPCOMING",
    keyword: "과학",
  },
  {
    festivalId: 6,
    regionIdx: 35,
    regionName: "전라북도",
    title: "전주 한옥 축제",
    thumbnailImageUrl:
      "https://tong.visitkorea.or.kr/cms/resource/91/3484791_image3_6.jpg",
    originalImageUrl:
      "https://tong.visitkorea.or.kr/cms/resource/91/3484791_image2_6.jpg",
    latitude: 35.8242,
    longitude: 127.148,
    address1: "전라북도 전주시 완산구 기린대로 99",
    address2: "전주한옥마을",
    eventStartDate: "2026-07-18",
    eventEndDate: "2026-07-22",
    telephone: "063-281-2114",
    status: "ENDED",
    keyword: "한옥",
  },
  {
    festivalId: 7,
    regionIdx: 24,
    regionName: "광주광역시",
    title: "광주 예술 축제",
    thumbnailImageUrl:
      "https://tong.visitkorea.or.kr/cms/resource/91/3484791_image3_7.jpg",
    originalImageUrl:
      "https://tong.visitkorea.or.kr/cms/resource/91/3484791_image2_7.jpg",
    latitude: 35.1595,
    longitude: 126.8526,
    address1: "광주광역시 동구 문화전당로 38",
    address2: "국립아시아문화전당",
    eventStartDate: "2026-09-10",
    eventEndDate: "2026-09-13",
    telephone: "062-120",
    status: "UPCOMING",
    keyword: "예술",
  },
  {
    festivalId: 8,
    regionIdx: 22,
    regionName: "대구광역시",
    title: "대구 치맥 페스티벌",
    thumbnailImageUrl:
      "https://tong.visitkorea.or.kr/cms/resource/91/3484791_image3_8.jpg",
    originalImageUrl:
      "https://tong.visitkorea.or.kr/cms/resource/91/3484791_image2_8.jpg",
    latitude: 35.8714,
    longitude: 128.6014,
    address1: "대구광역시 중구 동성로",
    address2: "동성로 일원",
    eventStartDate: "2026-08-14",
    eventEndDate: "2026-08-17",
    telephone: "053-120",
    status: "ONGOING",
    keyword: "치맥",
  },
  {
    festivalId: 9,
    regionIdx: 21,
    regionName: "부산광역시",
    title: "부산 불꽃 축제",
    thumbnailImageUrl:
      "https://tong.visitkorea.or.kr/cms/resource/91/3484791_image3_9.jpg",
    originalImageUrl:
      "https://tong.visitkorea.or.kr/cms/resource/91/3484791_image2_9.jpg",
    latitude: 35.1796,
    longitude: 129.0756,
    address1: "부산광역시 수영구 광안해변로 219",
    address2: "광안리 해변",
    eventStartDate: "2026-10-05",
    eventEndDate: "2026-10-05",
    telephone: "051-120",
    status: "UPCOMING",
    keyword: "불꽃",
  },
  {
    festivalId: 10,
    regionIdx: 39,
    regionName: "제주특별자치도",
    title: "제주 들불 축제",
    thumbnailImageUrl:
      "https://tong.visitkorea.or.kr/cms/resource/91/3484791_image3_10.jpg",
    originalImageUrl:
      "https://tong.visitkorea.or.kr/cms/resource/91/3484791_image2_10.jpg",
    latitude: 33.4996,
    longitude: 126.5312,
    address1: "제주특별자치도 제주시 애월읍",
    address2: "새별오름 일원",
    eventStartDate: "2026-11-01",
    eventEndDate: "2026-11-03",
    telephone: "064-120",
    status: "UPCOMING",
    keyword: "들불",
  },
];

export function createApiResponse<T>(
  code: string,
  message: string,
  data: T,
): ApiResponse<T> {
  return {
    success: true,
    code,
    message,
    data,
  };
}

export function getFestivalMapItems(): FestivalMapItem[] {
  return festivalRecords.map(({ festivalId, thumbnailImageUrl, latitude, longitude }) => ({
    festivalId,
    thumbnailImageUrl,
    latitude,
    longitude,
  }));
}

export function getFestivalListItems(filters: FestivalListFilters = {}): FestivalListData {
  const {
    regionIdx,
    year,
    month,
    statuses = festivalStatuses,
    keyword,
    page = 1,
    size = 20,
  } = filters;

  const normalizedKeyword = keyword?.trim().toLowerCase();
  const filtered = festivalRecords.filter((festival) => {
    if (regionIdx && festival.regionIdx !== regionIdx) {
      return false;
    }

    if (year && Number(festival.eventStartDate.slice(0, 4)) !== year) {
      return false;
    }

    if (month && Number(festival.eventStartDate.slice(5, 7)) !== month) {
      return false;
    }

    if (statuses.length > 0 && !statuses.includes(festival.status)) {
      return false;
    }

    if (
      normalizedKeyword &&
      ![festival.title, festival.address1, festival.address2, festival.keyword]
        .join(" ")
        .toLowerCase()
        .includes(normalizedKeyword)
    ) {
      return false;
    }

    return true;
  });

  const totalElements = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalElements / size));
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const start = (currentPage - 1) * size;
  const end = start + size;
  const pageItems = filtered.slice(start, end).map(
    ({
      festivalId,
      title,
      originalImageUrl,
      address1,
      address2,
      eventStartDate,
      eventEndDate,
      telephone,
      status,
      latitude,
      longitude,
    }) => ({
      festivalId,
      title,
      originalImageUrl,
      address1,
      address2,
      eventStartDate,
      eventEndDate,
      telephone,
      status,
      latitude,
      longitude,
    }),
  );

  return {
    festivals: pageItems,
    page: currentPage,
    size,
    totalElements,
    totalPages,
    first: currentPage === 1,
    last: currentPage === totalPages,
  };
}

export function getFestivalMapData(): FestivalMapData {
  return {
    festivals: getFestivalMapItems(),
  };
}

export function getRegionsData(): RegionsData {
  return {
    regions,
  };
}
