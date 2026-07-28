import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host") ?? "localhost:3000";
  const protocol = host.startsWith("localhost") ? "http" : "https";
  const isGitHubPages = process.env.GITHUB_PAGES === "true";
  const publicBase = isGitHubPages ? "/caojiangwebsite" : "";
  const origin = isGitHubPages
    ? "https://jamesjone1989.github.io/caojiangwebsite"
    : `${protocol}://${host}`;
  const title = "曹将｜把复杂的事情讲清楚";
  const description =
    "认识曹将的书、AI新手村、公众号、小红书、回声日记与结构化表达专栏。";

  return {
    title,
    description,
    icons: {
      icon: `${publicBase}/favicon.png`,
      shortcut: `${publicBase}/favicon.png`,
    },
    openGraph: {
      title,
      description,
      type: "website",
      locale: "zh_CN",
      images: [
        {
          url: `${origin}/og.png`,
          width: 1672,
          height: 941,
          alt: "曹将｜把复杂的事情讲清楚",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${origin}/og.png`],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
