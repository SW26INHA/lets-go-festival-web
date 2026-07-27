import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "전국 축제 지도",
  description: "전국 축제 검색과 지역 필터를 위한 지도 UI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
