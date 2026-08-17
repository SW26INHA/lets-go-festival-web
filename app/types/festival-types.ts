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
    festivalIdx: number;
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
    | "festivalIdx"
    | "title"
    | "thumbnailImageUrl"
    | "address1"
    | "address2"
    | "eventStartDate"
    | "eventEndDate"
    | "telephone"
    | "status"
    | "latitude"
    | "longitude"
>;

export type FestivalPoint = FestivalMapItem & {
    count: number;
};

export type FestivalListItem = Pick<
    FestivalRecord,
    | "festivalIdx"
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
