# Let's Go Festival Frontend

Next.js + React + TypeScript로 구성된 **축제 정보 서비스** 프론트엔드입니다.

백엔드 API에서 제공하는 전국 축제 정보를 네이버 지도와 목록으로 보여주고,
지역/연도/월/진행 상태/축제명 조건으로 원하는 축제를 검색할 수 있습니다.
목록에서 축제를 선택하면 지도에서 해당 축제의 위치를 확인할 수 있습니다.

- **서비스**: [전국 축제 지도](https://lets-go-festival-web.vercel.app)

<br />

## 기술 스택

| 구분 | 사용 기술 |
| ---- | --------- |
| **프레임워크** | Next.js 16.2.12 (App Router) |
| **UI** | React 19.2.4 |
| **언어** | TypeScript 5 |
| **스타일링** | Tailwind CSS 4, PostCSS |
| **상태 관리** | React Hooks |
| **API 통신** | 브라우저 Fetch API |
| **지도** | NAVER Maps JavaScript API v3 |
| **위치 정보** | 브라우저 Geolocation API |
| **코드 검사** | ESLint 9, eslint-config-next |

<br />

## 주요 기능

### 축제 검색

- 시/도, 연도, 월, 축제명을 조합하여 검색합니다.
- 진행중 / 예정 / 종료 상태를 복수 선택할 수 있습니다.
- 선택한 조건을 검색어 입력란 아래에 표시합니다. 상태 3개를 모두 선택하면 `전체`로 표시합니다.
- 검색 후 **축제 목록** 탭으로 이동하여 결과와 총 건수를 표시합니다.
- **초기화** 버튼은 지역/연도/월/검색어를 비우고 상태를 `진행중 + 예정`으로 되돌립니다.

### 축제 목록

- 첫 화면의 기본 탭은 **축제 검색**입니다.
- **축제 목록** 탭을 직접 누르면 진행중인 축제를 조회합니다.
- 카드에 이미지, 제목, 진행 상태, 주소, 기간, 전화번호를 표시합니다.
- 목록 하단으로 스크롤하면 다음 페이지를 20개씩 추가 조회합니다.
- 검색 결과 상단의 **X** 버튼을 누르면 기본 진행중 목록을 다시 조회합니다. 기본 목록에서는 X 버튼을 표시하지 않습니다.
- 목록 항목의 `festivalIdx`와 지도 데이터의 `festivalIdx`를 비교하여 해당 좌표로 이동합니다.

### 지도

- 축제를 개별 마커로 표시하며, 썸네일이 있으면 이미지 버블, 없으면 기본 파란색 버블을 표시합니다.
- 마커의 바깥 테두리와 hover 카드의 상태 배지는 진행중은 초록색, 예정은 파란색, 종료는 회색으로 구분합니다.
- 마커에 마우스를 올리면 이미지, 제목, 상태, 주소, 기간, 전화번호가 담긴 카드를 표시합니다.
- 마커를 클릭하면 해당 위치로 이동하고 줌 레벨 `14`로 확대합니다.
- 지도 생성과 마커 갱신을 분리하여 API 데이터가 도착해도 지도 중심과 줌이 초기화되지 않도록 구성했습니다.

### 현재 위치

지도가 준비되면 위치 정보를 자동으로 요청합니다.

| 상황 | 지도 동작 |
| ---- | --------- |
| 위치 확인 성공 | 현재 위치로 이동, 줌 `14` |
| 권한 거부 / 요청 실패 / 시간 초과 | 서울 중심(`37.5665, 126.978`)으로 이동, 줌 `12` |
| Geolocation 미지원 | 서울 중심으로 이동, 줌 `12` |

위치 요청 제한 시간은 10초이며, 최대 60초 이내의 캐시된 위치를 사용할 수 있습니다.
위치 확인 전에는 전국을 볼 수 있는 기본 지도(줌 `7`)가 먼저 표시됩니다.

<br />

## 실행 방법

### 1. 저장소 복제 및 의존성 설치

```bash
git clone https://github.com/SW26INHA/lets-go-festival-web.git
cd lets-go-festival-web
npm ci
```

### 2. 환경변수 설정

프로젝트 루트에 `.env.local`을 생성합니다.

| 키 | 필수 여부 | 설명 |
| -- | --------- | ---- |
| `NEXT_PUBLIC_NAVER_MAP_NCP_KEY_ID` | 지도 표시 시 필수 | 지도 SDK의 `ncpKeyId`에 전달할 키 ID |
| `NEXT_PUBLIC_FESTIVAL_API_BASE_URL` | 선택 | 백엔드 주소. 미설정 시 Render 백엔드 주소 사용 |

### 3. 개발 서버 실행

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 확인할 수 있습니다.

### 4. 운영 빌드 및 실행

```bash
npm run build
npm run start
```

<br />

## 스크립트 설명

| 스크립트 | 설명 |
| -------- | ---- |
| **dev** | Next.js 개발 서버 실행 |
| **build** | 운영용 빌드 생성 |
| **start** | 빌드된 Next.js 애플리케이션 실행 |
| **lint** | ESLint 규칙에 따라 코드 검사 |

<br />

### Vercel 설정

Vercel에서 `SW26INHA/lets-go-festival-web` 저장소를 연결하여 배포할 때 사용하는 설정입니다.

| 항목 | 값 |
| ---- | -- |
| Framework Preset | Next.js |
| Root Directory | 프로젝트 루트 (`./`) |
| Install Command | `npm ci` |
| Build Command | `npm run build` |
| Output Directory | Next.js 기본 설정 유지 |
| 환경변수 | `NEXT_PUBLIC_NAVER_MAP_NCP_KEY_ID`, `NEXT_PUBLIC_FESTIVAL_API_BASE_URL` |

Vercel에서는 Next.js 통합으로 실행을 관리하므로 별도 Start Command를 지정하지 않습니다.
`npm run start`는 로컬에서 운영 빌드를 확인하거나 별도의 Node.js 서버에서 실행할 때 사용합니다.

`NEXT_PUBLIC_` 환경변수는 빌드 시 브라우저용 코드에 반영됩니다.
운영 환경에서 키 ID 또는 백엔드 주소를 변경했다면 다시 빌드하고 배포해야 합니다.

네이버 지도 서비스의 웹 서비스 URL 설정에는 개발 주소와 실제 배포 주소를 등록합니다.

- 개발: `http://localhost:3000`
- 운영: `https://lets-go-festival-web.vercel.app`

<br />

## API 연동

브라우저에서 백엔드 API를 직접 호출합니다.

### 축제 목록 요청 파라미터

| 파라미터 | 설명 | 프론트엔드 처리 |
| -------- | ---- | --------------- |
| `regionIdx` | 시/도 인덱스 | 지역 선택 시 전달 |
| `year` | 연도 | 연도 선택 시 전달 |
| `month` | 월 | 월 선택 시 전달 |
| `statuses` | 진행 상태 | 선택한 상태를 콤마로 연결하여 전달 |
| `keyword` | 축제명 | 앞뒤 공백을 제거한 검색어 전달 |
| `page` | 페이지 번호 | `1`부터 시작하여 추가 조회 시 증가 |
| `size` | 페이지 크기 | `20` |

기본 축제 목록은 `statuses=ONGOING`으로 요청합니다.
검색 화면의 초기 상태는 `ONGOING,UPCOMING`이며, 상태를 모두 해제하면 `statuses`를 보내지 않습니다.

### 응답 및 오류 처리

응답은 `success`, `code`, `message`, `data` 구조를 사용합니다.
HTTP 응답 상태와 `success`를 확인한 후 데이터를 화면에 반영합니다.

- 지역 또는 지도 조회 실패 시 해당 데이터를 빈 배열로 처리합니다.
- 축제 검색 또는 기본 목록 조회 실패 시 목록을 비우고 오류 메시지를 표시합니다.
- 추가 페이지 조회 실패 시 기존 목록을 유지하고 오류 메시지를 표시합니다.
- API 오류 시 mock 데이터로 대체하지 않습니다.

지도용 응답은 종료되지 않은 축제를 대상으로 하므로, 검색한 종료 축제가 지도 데이터에 없으면 목록을 눌러도 지도 이동이 발생하지 않습니다.
검색 조건은 목록 조회에 적용되며, 지도 마커는 별도의 지도 API 응답을 사용합니다.

<br />

## 컴포넌트 구성

| 파일 | 역할 |
| ---- | ---- |
| `app/page.tsx` | 지역/지도 API 조회, 선택한 축제 ID와 좌표 연결 |
| `app/components/FestivalSidebar.tsx` | 검색 조건, 탭 전환, 목록, 무한 스크롤 |
| `app/components/NaverFestivalMap.tsx` | 지도 SDK 로드, 마커/hover 카드, 위치 조회, 확대/축소 |
| `app/types/festival-types.ts` | API 응답, 축제, 지역, 지도 데이터 타입 |
| `app/constants/festival-constants.ts` | 연도/월 선택 옵션 및 상태 라벨 |

`FestivalPoint`는 지도 API 타입인 `FestivalMapItem`에 `count`를 추가한 타입입니다.
현재는 각 축제에 `count: 1`을 부여하여 개별 마커로 표시합니다.

<br />

## 디렉토리 구조

```text
lets-go-festival-web/
├── app/
│   ├── components/
│   │   ├── FestivalSidebar.tsx       # 검색 및 축제 목록
│   │   └── NaverFestivalMap.tsx      # 네이버 지도 및 위치 연동
│   ├── constants/
│   │   └── festival-constants.ts     # 검색 옵션 및 상태 라벨
│   ├── types/
│   │   └── festival-types.ts         # API 및 축제 데이터 타입
│   ├── favicon.ico
│   ├── globals.css                  # 전역 스타일 및 지도 버블 스타일
│   ├── layout.tsx                   # 공통 레이아웃 및 메타데이터
│   └── page.tsx                     # 메인 페이지
├── public/                          # 정적 파일
├── eslint.config.mjs                # ESLint 설정
├── next.config.ts                   # Next.js 설정
├── postcss.config.mjs               # Tailwind CSS / PostCSS 설정
├── tsconfig.json                    # TypeScript 설정
├── package-lock.json
└── package.json
```

<br />

## 주의사항

- `.env.local`은 저장소에 커밋하지 않습니다. 배포 환경변수는 빌드 환경에 등록합니다.
- `NEXT_PUBLIC_` 값은 브라우저에 공개되므로 DB 비밀번호나 비밀 키를 넣지 않습니다.
- 네이버 지도 사용을 위해 로컬 및 운영 주소에 맞는 지도 서비스 설정이 필요합니다. 키가 없거나 SDK 로드에 실패하면 지도 대신 안내 메시지를 표시합니다.
- 현재 위치 기능은 사용자 권한이 필요하며, 운영 환경에서는 HTTPS로 서비스해야 합니다. 위치 정보를 받지 못하면 서울로 이동합니다.
