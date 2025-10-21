import { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Read articles about software engineering, programming experiences, and technology insights.",
  openGraph: {
    title: "Blog - Cuong (Kane)",
    description:
      "Read articles about software engineering, programming experiences, and technology insights.",
    type: "website",
    url: `${siteConfig.url}/blog`,
    images: [
      {
        url: `${siteConfig.url}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Cuong (Kane) Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog - Cuong (Kane)",
    description:
      "Read articles about software engineering, programming experiences, and technology insights.",
    images: [`${siteConfig.url}/og-image.png`],
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
