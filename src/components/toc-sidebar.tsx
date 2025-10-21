"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TableOfContents, TocItem } from "./toc";

interface TocSidebarProps {
  toc: TocItem[];
}

export function TocSidebar({ toc }: TocSidebarProps) {
  const [isOpen, setIsOpen] = useState(true);

  if (!toc || toc.length === 0) {
    return null;
  }

  return (
    /* Desktop TOC Sidebar - sticky on left side */
    <aside
      className={cn(
        "hidden lg:block sticky top-20 shrink-0 self-start transition-all duration-300",
        isOpen ? "w-64" : "w-12"
      )}
    >
      <div className="relative">
        {/* Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "absolute top-0 z-10 flex h-10 w-10 items-center justify-center rounded-full border bg-background shadow-md transition-all hover:bg-muted hover:scale-110",
            isOpen ? "-right-5" : "right-1"
          )}
          aria-label={isOpen ? "Hide table of contents" : "Show table of contents"}
        >
          {isOpen ? (
            <ChevronLeft className="h-5 w-5" />
          ) : (
            <ChevronRight className="h-5 w-5" />
          )}
        </button>

        {/* TOC Content */}
        <div
          className={cn(
            "rounded-lg border bg-card max-h-[calc(100vh-6rem)] overflow-y-auto transition-all duration-300",
            !isOpen && "opacity-0 invisible"
          )}
        >
          <div className="p-6">
            <TableOfContents toc={toc} />
          </div>
        </div>
      </div>
    </aside>
  );
}

export function MobileToc({ toc }: { toc: TocItem[] }) {
  if (!toc || toc.length === 0) {
    return null;
  }

  return (
    /* Mobile TOC - shown before content */
    <div className="lg:hidden mb-8">
      <div className="rounded-lg border bg-card p-6">
        <TableOfContents toc={toc} />
      </div>
    </div>
  );
}
