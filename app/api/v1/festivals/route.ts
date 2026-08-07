import { createApiResponse, getFestivalListItems } from "@/app/data/festival-mock";

function parseStatuses(value: string | null) {
  if (!value) {
    return undefined;
  }

  const statuses = value
    .split(",")
    .map((status) => status.trim().toUpperCase())
    .filter(Boolean) as Array<"ONGOING" | "UPCOMING" | "ENDED">;

  return statuses.length > 0 ? statuses : undefined;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const regionIdx = url.searchParams.get("regionIdx");
  const year = url.searchParams.get("year");
  const month = url.searchParams.get("month");
  const keyword = url.searchParams.get("keyword");
  const page = url.searchParams.get("page");
  const size = url.searchParams.get("size");

  const response = getFestivalListItems({
    regionIdx: regionIdx ? Number(regionIdx) : undefined,
    year: year ? Number(year) : undefined,
    month: month ? Number(month) : undefined,
    statuses: parseStatuses(url.searchParams.get("statuses")),
    keyword: keyword ?? undefined,
    page: page ? Number(page) : undefined,
    size: size ? Number(size) : undefined,
  });

  return Response.json(
    createApiResponse(
      "FESTIVAL_LIST_SUCCESS",
      "축제 목록 조회를 성공하였습니다.",
      response,
    ),
  );
}

