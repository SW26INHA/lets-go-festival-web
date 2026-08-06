import { createApiResponse, getFestivalMapData } from "@/app/data/festival-mock";

export async function GET() {
  return Response.json(
    createApiResponse(
      "FESTIVAL_MAP_LIST_SUCCESS",
      "지도용 축제 목록 조회를 성공하였습니다.",
      getFestivalMapData(),
    ),
  );
}

