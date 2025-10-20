"use client";

import React, { useState, useMemo } from "react";
import PageHeader from "@/components/page-header";
import { blogs as allBlogs } from "#site/content";
import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";

const POSTS_PER_PAGE = 10;

export default function BlogPage() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [collapsedYears, setCollapsedYears] = useState<Set<number>>(new Set());

  // Get all published blogs sorted by date
  const publishedBlogs = useMemo(() => {
    return allBlogs
      .filter((blog) => blog.published)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, []);

  // Extract all unique tags
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    publishedBlogs.forEach((blog) => {
      blog.tags?.forEach((tag) => tagsSet.add(tag));
    });
    return Array.from(tagsSet).sort();
  }, [publishedBlogs]);

  // Filter blogs by selected tags
  const filteredBlogs = useMemo(() => {
    if (selectedTags.length === 0) return publishedBlogs;
    return publishedBlogs.filter((blog) =>
      selectedTags.every((tag) => blog.tags?.includes(tag))
    );
  }, [publishedBlogs, selectedTags]);

  // Pagination
  const totalPages = Math.ceil(filteredBlogs.length / POSTS_PER_PAGE);
  const paginatedBlogsByYear = useMemo(() => {
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    const endIndex = startIndex + POSTS_PER_PAGE;
    const paginatedBlogs = filteredBlogs.slice(startIndex, endIndex);

    const grouped = new Map<number, typeof paginatedBlogs>();
    paginatedBlogs.forEach((blog) => {
      const year = new Date(blog.date).getFullYear();
      if (!grouped.has(year)) {
        grouped.set(year, []);
      }
      grouped.get(year)!.push(blog);
    });
    return new Map(Array.from(grouped.entries()).sort((a, b) => b[0] - a[0]));
  }, [filteredBlogs, currentPage]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
    setCurrentPage(1); // Reset to first page when filtering
  };

  const toggleYear = (year: number) => {
    setCollapsedYears((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(year)) {
        newSet.delete(year);
      } else {
        newSet.add(year);
      }
      return newSet;
    });
  };

  return (
    <div className="container py-6 lg:py-10">
      <div className="max-w-6xl mx-auto">
        <PageHeader
          title="Blog"
          description="A blog using velite. Posts are written in MDX"
        />
        <hr className="my-8" />

        {/* Two Column Layout: Sidebar + Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar - Tags */}
          {allTags.length > 0 && (
            <aside className="lg:w-64 lg:flex-shrink-0">
              <div className="lg:sticky lg:top-20">
                <h3 className="mb-4 text-sm font-semibold uppercase text-muted-foreground">
                  Filter by Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`inline-block rounded-md px-2 py-1 text-sm transition-colors ${
                        selectedTags.includes(tag)
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
                {selectedTags.length > 0 && (
                  <button
                    onClick={() => {
                      setSelectedTags([]);
                      setCurrentPage(1);
                    }}
                    className="mt-4 text-sm text-muted-foreground hover:text-foreground"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            </aside>
          )}

          {/* Right Content - Blog Posts */}
          <main className="flex-1 min-w-0">
            {filteredBlogs.length > 0 ? (
              <div className="space-y-10">
                {Array.from(paginatedBlogsByYear.entries()).map(([year, blogs]) => (
                  <div key={year} className="space-y-4">
                    {/* Year Header */}
                    <button
                      onClick={() => toggleYear(year)}
                      className="flex w-full items-center gap-2 text-left"
                    >
                      <h2 className="text-3xl font-bold">{year}</h2>
                      {collapsedYears.has(year) ? (
                        <ChevronDown className="h-6 w-6" />
                      ) : (
                        <ChevronUp className="h-6 w-6" />
                      )}
                    </button>

                    {/* Posts for this year */}
                    {!collapsedYears.has(year) && (
                      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
                        {blogs.map((blog) => (
                          <article
                            key={blog.slug}
                            className="group relative flex flex-col space-y-2"
                          >
                            {blog.image && (
                              <Image
                                src={blog.image}
                                alt={blog.title}
                                width={804}
                                height={452}
                                className="border bg-muted transition-colors"
                              />
                            )}

                            <h3 className="text-xl font-extrabold text-primary">
                              {blog.title}
                            </h3>

                            {blog.description && (
                              <p className="text-sm text-muted-foreground">
                                {blog.description}
                              </p>
                            )}

                            {/* Tags */}
                            {blog.tags && blog.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {blog.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}

                            {blog.date && (
                              <p className="text-xs text-muted-foreground">
                                {formatDate(blog.date)}
                              </p>
                            )}

                            <Link href={blog.slug} className="absolute inset-0">
                              <span className="sr-only">View Article</span>
                            </Link>
                          </article>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-10 flex items-center justify-center gap-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="rounded-md border px-3 py-1 text-sm disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <div className="flex gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`rounded-md px-3 py-1 text-sm ${
                              currentPage === page
                                ? "bg-primary text-primary-foreground"
                                : "border hover:bg-muted"
                            }`}
                          >
                            {page}
                          </button>
                        )
                      )}
                    </div>
                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="rounded-md border px-3 py-1 text-sm disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                )}

                {/* Results count */}
                <p className="text-center text-sm text-muted-foreground">
                  Showing {(currentPage - 1) * POSTS_PER_PAGE + 1} -{" "}
                  {Math.min(currentPage * POSTS_PER_PAGE, filteredBlogs.length)} of{" "}
                  {filteredBlogs.length} posts
                </p>
              </div>
            ) : (
              <p>No blogs found matching the selected filters</p>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
