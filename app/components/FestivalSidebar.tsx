"use client";

import { type ReactNode, useMemo, useState } from "react";
import type {
  ApiResponse,
  FestivalListData,
  FestivalStatus,
  Region,
} from "@/app/types/festival-types";
import {
  festivalMonths,
  festivalStatusOptions,
  festivalYears,
} from "@/app/constants/festival-constants";

type FestivalSidebarProps = {
  regions: Region[];
  onFestivalSelect: (festivalIdx: string) => void;
};

type SearchResultState = {
  festivals: FestivalListData["festivals"];
  totalElements: number;
  page: number;
  size: number;
  totalPages: number;
  first: boolean;
  last: boolean;
};

type SearchFiltersState = {
  regionIdx: string;
  year: string;
  month: string;
  keyword: string;
  selectedStatuses: FestivalStatus[];
};

type ListMode = "search" | "all";

const defaultStatuses: FestivalStatus[] = ["ONGOING", "UPCOMING"];
const defaultPopularFilters: SearchFiltersState = {
  regionIdx: "",
  year: "",
  month: "",
  keyword: "",
  selectedStatuses: ["ONGOING"],
};

function statusLabel(status: FestivalStatus) {
  return festivalStatusOptions.find((option) => option.value === status)?.label ?? status;
}

function statusBadgeClass(status: FestivalStatus) {
  if (status === "ONGOING") {
    return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  }

  if (status === "UPCOMING") {
    return "bg-blue-50 text-blue-700 ring-blue-200";
  }

  return "bg-slate-100 text-slate-600 ring-slate-200";
}

function formatDate(date: string) {
  return date.replaceAll("-", ".");
}

function selectTriggerClassName() {
  return [
    "h-10 w-full appearance-none rounded-2xl border border-slate-200 bg-white px-3 pr-10",
    "text-sm text-slate-700 shadow-sm outline-none transition",
    "focus:border-blue-300 focus:ring-2 focus:ring-blue-100",
  ].join(" ");
}

function selectArrowClassName() {
  return "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400";
}

function statusChipClassName(selected: boolean) {
  return [
    "flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition",
    selected
      ? "border-blue-200 bg-blue-50 text-blue-700"
      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
  ].join(" ");
}

function buildFilterSummary(
  regions: Region[],
  regionIdx: string,
  year: string,
  month: string,
  selectedStatuses: FestivalStatus[],
) {
  const parts: string[] = [];
  const regionName = regions.find((region) => String(region.regionIdx) === regionIdx)?.regionName;

  if (regionName) {
    parts.push(regionName);
  }

  if (year) {
    parts.push(`${year}년`);
  }

  if (month) {
    parts.push(`${month}월`);
  }

  if (selectedStatuses.length === festivalStatusOptions.length) {
    parts.push("전체");
  } else if (selectedStatuses.length > 0) {
    parts.push(selectedStatuses.map(statusLabel).join(" · "));
  }

  return parts;
}

function FestivalListHeader({
  title,
  description,
  onReset,
}: {
  title: string;
  description: string;
  onReset: () => void;
}) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3 rounded-2xl border border-blue-200 bg-white px-4 py-3 shadow-sm">
      <div className="min-w-0">
        <h2 className="text-base font-bold leading-tight text-slate-900">{title}</h2>
        <p className="mt-1.5 text-xs leading-5 text-slate-500">{description}</p>
      </div>
      <button
        className="shrink-0 px-2 text-2xl font-semibold leading-none text-slate-500 transition hover:text-slate-700"
        onClick={onReset}
        type="button"
      >
        X
      </button>
    </div>
  );
}

function FestivalCardButton({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      className="w-full rounded-2xl border border-blue-100 bg-white p-3 text-left shadow-sm transition hover:border-blue-200 hover:bg-blue-50/40"
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

const apiBaseUrl =
  process.env.NEXT_PUBLIC_FESTIVAL_API_BASE_URL ??
  "https://lets-go-festival-backend.onrender.com";

function createApiUrl(path: string) {
  return `${apiBaseUrl.replace(/\/$/, "")}${path}`;
}

export default function FestivalSidebar({
  regions,
  onFestivalSelect,
}: FestivalSidebarProps) {
  const [activeTab, setActiveTab] = useState<"popular" | "search">("search");
  const [regionIdx, setRegionIdx] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [keyword, setKeyword] = useState("");
  const [selectedStatuses, setSelectedStatuses] =
    useState<FestivalStatus[]>(defaultStatuses);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [listMode, setListMode] = useState<ListMode>("all");
  const [searchFilters, setSearchFilters] = useState<SearchFiltersState | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResultState>({
    festivals: [],
    totalElements: 0,
    page: 1,
    size: 20,
    totalPages: 0,
    first: true,
    last: true,
  });

  const filterSummary = useMemo(
    () => buildFilterSummary(regions, regionIdx, year, month, selectedStatuses),
    [regions, regionIdx, year, month, selectedStatuses],
  );
  const searchSummary = useMemo(
    () =>
      searchFilters
        ? buildFilterSummary(
            regions,
            searchFilters.regionIdx,
            searchFilters.year,
            searchFilters.month,
            searchFilters.selectedStatuses,
          )
        : [],
    [regions, searchFilters],
  );
  const popularTabTitle =
    listMode === "search" ? "검색 결과" : "진행중 축제";
  const popularTabDescription =
    listMode === "search"
      ? `총 ${searchResults.totalElements}건${
          searchSummary.length > 0 ? ` · ${searchSummary.join(" · ")}` : ""
        }`
      : `총 ${searchResults.totalElements}건`;

  function buildSearchParams(filters: SearchFiltersState | null, page: number) {
    const params = new URLSearchParams();

    if (filters?.regionIdx) {
      params.set("regionIdx", filters.regionIdx);
    }

    if (filters?.year) {
      params.set("year", filters.year);
    }

    if (filters?.month) {
      params.set("month", filters.month);
    }

    if (filters?.keyword.trim()) {
      params.set("keyword", filters.keyword.trim());
    }

    if (filters && filters.selectedStatuses.length > 0) {
      params.set("statuses", filters.selectedStatuses.join(","));
    }

    params.set("page", String(page));
    params.set("size", "20");

    return params;
  }

  async function fetchFestivalList(filters: SearchFiltersState | null, page: number) {
    const response = await fetch(
      createApiUrl(`/api/v1/festivals?${buildSearchParams(filters, page).toString()}`),
    );
    const payload = (await response.json()) as ApiResponse<FestivalListData>;

    if (!response.ok || !payload.success) {
      throw new Error(payload.message || "축제 목록을 불러오지 못했습니다.");
    }

    return payload.data;
  }

  const handleStatusToggle = (status: FestivalStatus) => {
    setSelectedStatuses((current) =>
      current.includes(status)
        ? current.filter((item) => item !== status)
        : [...current, status],
    );
  };

  const handleSearch = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const filters = {
        regionIdx,
        year,
        month,
        keyword,
        selectedStatuses,
      };

      const data = await fetchFestivalList(filters, 1);

      setSearchResults(data);
      setSearchFilters(filters);
      setListMode("search");
      setActiveTab("popular");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "검색 중 알 수 없는 오류가 발생했습니다.",
      );
      setSearchResults({
        festivals: [],
        totalElements: 0,
        page: 1,
        size: 20,
        totalPages: 0,
        first: true,
        last: true,
      });
      setSearchFilters({
        regionIdx,
        year,
        month,
        keyword,
        selectedStatuses,
      });
      setListMode("search");
      setActiveTab("popular");
    } finally {
      setLoading(false);
    }
  };

  const loadMoreResults = async () => {
    if (
      loading ||
      loadingMore ||
      searchResults.last ||
      searchResults.page >= searchResults.totalPages
    ) {
      return;
    }

    setLoadingMore(true);

    try {
      const nextPage = searchResults.page + 1;
      const data = await fetchFestivalList(
        listMode === "search" ? searchFilters : defaultPopularFilters,
        nextPage,
      );

      setSearchResults((current) => ({
        ...data,
        festivals: [...current.festivals, ...data.festivals],
      }));
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "추가 결과를 불러오는 중 오류가 발생했습니다.",
      );
    } finally {
      setLoadingMore(false);
    }
  };

  const loadDefaultFestivalList = async () => {
    try {
      setLoading(true);
      const data = await fetchFestivalList(defaultPopularFilters, 1);
      setSearchResults(data);
      setListMode("all");
      setSearchFilters(null);
      setActiveTab("popular");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "진행중 축제 목록을 불러오는 중 오류가 발생했습니다.",
      );
      setSearchResults({
        festivals: [],
        totalElements: 0,
        page: 1,
        size: 20,
        totalPages: 0,
        first: true,
        last: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearchReset = () => {
    setRegionIdx("");
    setYear("");
    setMonth("");
    setKeyword("");
    setSelectedStatuses(defaultStatuses);
    setErrorMessage("");
    setLoadingMore(false);
    setSearchFilters(null);
    setActiveTab("search");
  };

  const handleListReset = () => {
    setErrorMessage("");
    setLoadingMore(false);
    void loadDefaultFestivalList();
  };

  const handlePopularTabClick = () => {
    void loadDefaultFestivalList();
  };

  const handleFestivalSelect = (festivalId: string) => {
    onFestivalSelect(festivalId);
    setActiveTab("popular");
  };

  return (
    <aside className="flex h-[calc(100vh-44px)] flex-col overflow-hidden border-r border-blue-100 bg-[#f8fbff] max-lg:h-auto max-lg:min-h-0 max-lg:border-b max-lg:border-r-0">
      <section className="px-6 pt-5">
        <div className="grid grid-cols-2 border-b border-slate-200 text-center text-base font-bold">
          <button
            className={`border-b-3 pb-3 ${
              activeTab === "search"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500"
            }`}
            onClick={() => setActiveTab("search")}
            type="button"
          >
            축제 검색
          </button>
          <button
            className={`border-b-3 pb-3 ${
              activeTab === "popular"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500"
            }`}
            onClick={handlePopularTabClick}
            type="button"
          >
            축제 목록
          </button>
        </div>
      </section>

      {activeTab === "search" ? (
        <section className="space-y-5 px-5 py-5">
          <fieldset>
            <legend className="mb-3 text-sm font-bold text-slate-900">지역선택</legend>
            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <select
                  className={selectTriggerClassName()}
                  value={regionIdx}
                  onChange={(event) => setRegionIdx(event.target.value)}
                >
                  <option value="">시/도</option>
                  {regions.map((region) => (
                    <option key={region.regionIdx} value={region.regionIdx}>
                      {region.regionName}
                    </option>
                  ))}
                </select>
                <span className={selectArrowClassName()}>▾</span>
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-3 text-sm font-bold text-slate-900">날짜범위</legend>
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
              <div className="relative">
                <select
                  className={selectTriggerClassName()}
                  value={year}
                  onChange={(event) => setYear(event.target.value)}
                >
                  <option value="">년도</option>
                  {festivalYears.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <span className={selectArrowClassName()}>▾</span>
              </div>
              <span className="text-slate-400">~</span>
              <div className="relative">
                <select
                  className={selectTriggerClassName()}
                  value={month}
                  onChange={(event) => setMonth(event.target.value)}
                >
                  <option value="">월</option>
                  {festivalMonths.map((item) => (
                    <option key={item} value={item}>
                      {item}월
                    </option>
                  ))}
                </select>
                <span className={selectArrowClassName()}>▾</span>
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-3 text-sm font-bold text-slate-900">축제 분류</legend>
            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-2">
                {festivalStatusOptions.map((status) => (
                  <label
                    key={status.value}
                    className={statusChipClassName(selectedStatuses.includes(status.value))}
                  >
                    <input
                      checked={selectedStatuses.includes(status.value)}
                      className="sr-only"
                      onChange={() => handleStatusToggle(status.value)}
                      type="checkbox"
                    />
                    <span className="size-2 rounded-full bg-current opacity-70" />
                    {status.label}
                  </label>
                ))}
              </div>
            </div>
          </fieldset>

          <div className="rounded-2xl border border-blue-100 bg-white p-3 shadow-sm">
            <div className="flex items-center gap-2">
              <input
                className="h-11 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm"
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="축제명 입력"
                type="search"
                value={keyword}
              />
            </div>
            {filterSummary.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {filterSummary.map((item) => (
                  <span
                    className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-semibold text-blue-700 ring-1 ring-blue-100"
                    key={item}
                  >
                    {item}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              className="h-11 flex-1 rounded-full bg-blue-600 text-base font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
              disabled={loading}
              onClick={handleSearch}
              type="button"
            >
              {loading ? "검색 중..." : "검색하기"}
            </button>
            <button
              className="h-11 rounded-full border border-slate-200 bg-white px-4 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
              onClick={handleSearchReset}
              type="button"
            >
              초기화
            </button>
          </div>
        </section>
      ) : null}

      {activeTab === "popular" ? (
        <section className="flex min-h-0 flex-1 flex-col border-t border-slate-100 bg-[#f8fbff] px-5 pb-5 pt-3">
          <FestivalListHeader
            description={popularTabDescription}
            onReset={handleListReset}
            title={popularTabTitle}
          />

          {errorMessage ? (
            <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {errorMessage}
            </div>
          ) : null}

          <div
            className="min-h-0 flex-1 overflow-y-auto pr-1"
            onScroll={(event) => {
              if (searchResults.last || loadingMore || loading) {
                return;
              }

              const target = event.currentTarget;
              const remaining = target.scrollHeight - target.scrollTop - target.clientHeight;

              if (remaining < 96) {
                void loadMoreResults();
              }
            }}
          >
              <div className="space-y-3">
                {searchResults.festivals.length > 0 ? (
                  searchResults.festivals.map((festival) => (
                    <FestivalCardButton
                      onClick={() => handleFestivalSelect(String(festival.festivalIdx))}
                      key={festival.festivalIdx}
                    >
                      <div className="flex gap-3">
                        <div className="size-16 shrink-0 overflow-hidden rounded-xl bg-blue-50">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            alt={festival.title}
                            className="size-full object-cover"
                            src={festival.originalImageUrl}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="truncate text-sm font-bold text-slate-900">
                              {festival.title}
                            </h3>
                            <span
                              className={`shrink-0 rounded-full px-2 py-1 text-[11px] font-bold ring-1 ${statusBadgeClass(
                                festival.status,
                              )}`}
                            >
                              {statusLabel(festival.status)}
                            </span>
                          </div>
                          <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                            {festival.address1} {festival.address2}
                          </p>
                          <p className="mt-2 text-xs font-medium text-slate-600">
                            {formatDate(festival.eventStartDate)} ~{" "}
                            {formatDate(festival.eventEndDate)}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">{festival.telephone}</p>
                        </div>
                      </div>
                    </FestivalCardButton>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center">
                    <p className="text-sm font-semibold text-slate-700">
                      검색 결과가 없습니다.
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      조건을 조금 넓혀서 다시 검색해보세요.
                    </p>
                  </div>
                )}
                {loadingMore ? (
                  <div className="py-3 text-center text-xs font-medium text-slate-500">
                    더 불러오는 중...
                  </div>
                ) : null}
              </div>
          </div>
        </section>
      ) : null}
    </aside>
  );
}
