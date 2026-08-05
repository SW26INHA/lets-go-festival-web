import NaverFestivalMap from "@/app/components/NaverFestivalMap";
import { festivals } from "@/app/data/festivals";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-100 text-slate-800">
      <header className="flex h-11 items-center justify-between border-b border-slate-200 bg-white px-5">
        <div className="flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded bg-blue-600 text-[13px] font-bold text-white">
            ⌖
          </span>
          <h1 className="text-lg font-bold tracking-normal text-slate-900">
            전국 축제 지도
          </h1>
        </div>

        <nav className="flex items-center gap-6 text-sm font-semibold">
          <a className="flex items-center gap-1.5 text-slate-500" href="#">
            <span className="text-xs">☰</span>
            목록 보기
          </a>
        </nav>
      </header>

      <div className="grid min-h-[calc(100vh-44px)] grid-cols-[360px_minmax(0,1fr)] max-lg:grid-cols-1">
        <aside className="flex min-h-[calc(100vh-44px)] flex-col border-r border-slate-200 bg-white max-lg:min-h-0 max-lg:border-b max-lg:border-r-0">
          <section className="px-6 pt-5">
            <div className="grid grid-cols-2 border-b border-slate-200 text-center text-base font-bold">
              <button className="border-b-3 border-blue-600 pb-3 text-blue-600">
                축제 검색
              </button>
              <button className="pb-3 text-slate-500">자주 찾는 축제</button>
            </div>
          </section>

          <section className="flex-1 space-y-8 px-6 py-6">
            <fieldset>
              <legend className="mb-3 text-sm font-bold text-slate-900">
                지역선택
              </legend>
              <div className="grid grid-cols-2 gap-2">
                <select className="h-10 rounded border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm">
                  <option>시/도</option>
                </select>
              </div>
            </fieldset>

            <fieldset>
              <legend className="mb-3 text-sm font-bold text-slate-900">
                날짜범위
              </legend>
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                <select className="h-10 rounded border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm">
                  <option>년도</option>
                </select>
                <span className="text-slate-400">~</span>
                <select className="h-10 rounded border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm">
                  <option>월</option>
                </select>
              </div>
            </fieldset>

            <fieldset>
              <legend className="mb-3 text-sm font-bold text-slate-900">
                축제 분류
              </legend>
              <div className="grid grid-cols-[1fr_150px] gap-2">
                <select className="h-10 rounded border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm">
                  <option>전체</option>
                </select>
                <div className="space-y-1 text-sm text-slate-600">
                  <label className="flex items-center gap-2">
                    <input className="size-4 accent-blue-600" type="checkbox" />
                    진행중
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      className="size-4 accent-blue-600"
                      type="checkbox"
                      defaultChecked
                    />
                    예정
                  </label>
                </div>
              </div>
            </fieldset>

            <fieldset>
              <legend className="mb-3 text-sm font-bold text-slate-900">
                축제 타입
              </legend>
              <select className="h-10 w-full rounded border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm">
                <option>전체</option>
              </select>
            </fieldset>

            <div className="grid grid-cols-[110px_1fr] gap-2">
              <select className="h-10 rounded border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm">
                <option>축제명</option>
              </select>
              <input
                className="h-10 rounded border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm"
                placeholder="검색어 입력"
                type="search"
              />
            </div>
          </section>

          <section className="border-t border-slate-100 px-6 py-7">
            <div className="grid grid-cols-2 gap-2">
              <button className="h-11 rounded-full bg-slate-950 text-base font-bold text-white shadow-sm">
                검색하기
              </button>
              <button className="h-11 rounded-full border border-blue-500 bg-blue-50 text-base font-bold text-blue-600">
                초기화
              </button>
            </div>
            {/*
            <p className="mt-9 text-center text-sm leading-6 text-slate-700">
              검색 결과가 없습니다.
              <br />
              [검색하기]를 클릭하세요.
            </p>
            */}
          </section>
        </aside>

        <NaverFestivalMap points={festivals} />
      </div>
    </main>
  );
}
