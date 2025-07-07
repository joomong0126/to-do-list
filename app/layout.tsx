import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://to-do-list-fawn-nine.vercel.app'),
  keywords: ["할 일 목록", "todo list", "업무 관리", "일정 관리", "생산성", "task management", "productivity", "무료 앱"],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Google Search Console verification 코드
    google: 'X_sqXxkLaLe2ZW4Xyjgf-KjKZqYDjqvYUwwHceP3gh4',
  },
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
        
        {/* 구조화된 데이터 (JSON-LD) */}
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "TaskFlow Pro",
              "url": "https://to-do-list-fawn-nine.vercel.app",
              "description": "간편한 할 일 관리 웹앱으로 일정과 목표를 효율적으로 관리하세요!",
              "applicationCategory": "ProductivityApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "KRW"
              },
              "author": {
                "@type": "Organization",
                "name": "TaskFlow Pro"
              }
            })
          }}
        />
        
        <Script
          src="//t1.daumcdn.net/kas/static/ba.min.js"
          strategy="afterInteractive"
          async
        />
      </body>
    </html>
  );
}