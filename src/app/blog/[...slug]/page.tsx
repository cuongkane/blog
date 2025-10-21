import React from "react";
import { Metadata } from "next";
import { blogs as allBlogs } from "#site/content";
import { cn, formatDate } from "@/lib/utils";
import "@/styles/mdx.css";

import Image from "next/image";
import { siteConfig } from "@/config/site";
import { Mdx } from "@/components/mdx-component";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { TocSidebar, MobileToc } from "@/components/toc-sidebar";

interface BlogPageItemProps {
  params: {
    slug: string[];
  };
}

async function getBlogFromParams(params: BlogPageItemProps["params"]) {
  const slug = params?.slug.join("/");
  const blog = allBlogs.find((blog) => blog.slugAsParams === slug);

  if (!blog) {
    return null;
  }

  return blog;
}

export async function generateMetadata({
  params,
}: BlogPageItemProps): Promise<Metadata> {
  const blog = await getBlogFromParams(params);

  if (!blog) {
    return {};
  }

  return {
    title: blog.title,
    description: blog.description,
    authors: {
      name: blog.author,
    },
  };
}

export async function generateStaticParams(): Promise<
  BlogPageItemProps["params"][]
> {
  return allBlogs.map((blog) => ({
    slug: blog.slugAsParams.split("/"),
  }));
}

export default async function BlogPageItem({ params }: BlogPageItemProps) {
  const blog = await getBlogFromParams(params);

  if (!blog) {
    return {};
  }

  return (
    <article className="container max-w-[1400px] py-6 lg:py-10">
      <div className="flex w-full gap-8 lg:gap-10">
        {/* Desktop TOC Sidebar with toggle */}
        <TocSidebar toc={blog.toc} />

        {/* Main Content */}
        <div className="min-w-0 flex-1 w-full">
          {blog.date && (
            <time
              dateTime={blog.date}
              className="block text-sm text-muted-foreground"
            >
              Published on {formatDate(blog.date)}
            </time>
          )}

          <h1 className="mt-2 inline-block text-4xl font-bold capitalize leading-tight text-primary lg:text-5xl">
            {blog.title}
          </h1>

          {blog.author && (
            <div className="mt-4 flex space-x-4">
              <div className="flex size-10 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                {blog.author.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 text-left leading-tight">
                <p className="font-medium">{blog.author}</p>
                <p className="text-[12px] text-muted-foreground">
                  @{blog.author}
                </p>
              </div>
            </div>
          )}

          {blog.image && (
            <Image
              src={blog.image}
              alt={blog.title}
              width={720}
              height={405}
              priority
              className="my-8 border bg-muted transition-colors"
            />
          )}

          {/* Mobile TOC - shown before blog content */}
          <MobileToc toc={blog.toc} />

          <Mdx code={blog.body} />
          <hr className="mt-12" />
          <div className="flex justify-center py-6 lg:py-10">
            <Link
              href="/blog"
              className={cn(buttonVariants({ variant: "ghost" }))}
            >
              <ChevronLeft className="mr-2 size-4" />
              See all Blogs
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
