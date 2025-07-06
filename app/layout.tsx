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
  title: "TaskFlow Pro - 스마트한 할 일 관리 플랫폼",
  description: "현대적이고 세련된 할 일 관리 플랫폼으로 생산성을 높이세요",
  openGraph: {
    title: "TaskFlow Pro - 스마트한 할 일 관리 플랫폼",
    description: "현대적이고 세련된 할 일 관리 플랫폼으로 생산성을 높이세요",
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
    title: "TaskFlow Pro - 스마트한 할 일 관리 플랫폼",
    description: "현대적이고 세련된 할 일 관리 플랫폼으로 생산성을 높이세요",
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