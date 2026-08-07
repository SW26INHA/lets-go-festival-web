import { createApiResponse, getRegionsData } from "@/app/data/festival-mock";

export async function GET() {
  return Response.json(
    createApiResponse(
      "REGIONS_LIST_SUCCESS",
      "시/도 목록 조회를 성공하였습니다.",
      getRegionsData(),
    ),
  );
}

