import {FestivalStatus} from "@/app/types/festival-types";

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