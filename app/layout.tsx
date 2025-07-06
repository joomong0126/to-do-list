import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "sonner";

const pretendard = localFont({
  src: "./../node_modules/pretendard/dist/web/variable/woff2/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
});

export const metadata: Metadata = {
  title: "할 일 목록 앱 - TaskFlow Pro | 무료 To-Do List 웹앱",
  description: "간편한 할 일 관리 웹앱으로 일정과 목표를 효율적으로 관리하세요! 무료 To-Do List 앱, 실시간 동기화, 카테고리별 정리 기능까지. 지금 바로 시작해보세요!",
  openGraph: {
    title: "할 일 목록 앱 - TaskFlow Pro | 무료 To-Do List 웹앱",
    description: "간편한 할 일 관리 웹앱으로 일정과 목표를 효율적으로 관리하세요! 무료 To-Do List 앱, 실시간 동기화, 카테고리별 정리 기능까지. 지금 바로 시작해보세요!",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "TaskFlow Pro - 할 일 관리 플랫폼",
      },
    ],
    locale: "ko_KR",
    type: "website",
    siteName: "TaskFlow Pro",
  },
  twitter: {
    card: "summary_large_image",
    title: "할 일 목록 앱 - TaskFlow Pro | 무료 To-Do List 웹앱",
    description: "간편한 할 일 관리 웹앱으로 일정과 목표를 효율적으로 관리하세요! 무료 To-Do List 앱, 실시간 동기화, 카테고리별 정리 기능까지. 지금 바로 시작해보세요!",
    images: ["/og-image.png"],
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={pretendard.className}>
      <body className={`${pretendard.variable} antialiased`}>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}