"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface TocItem {
  title: string;
  url: string;
  items: TocItem[];
}

interface TocProps {
  toc: TocItem[];
  className?: string;
}

export function TableOfContents({ toc, className }: TocProps) {
  if (!toc || toc.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-2", className)}>
      <p className="font-medium">On This Page</p>
      <Tree tree={toc} />
    </div>
  );
}

export function Tree({ tree, level = 1 }: { tree: TocItem[]; level?: number }) {
  return tree?.length && level < 3 ? (
    <ul className={cn("m-0 list-none", { "pl-4": level !== 1 })}>
      {tree.map((item, index) => {
        return (
          <li key={index} className={cn("mt-0 pt-2")}>
            <a
              href={item.url}
              className={cn(
                "inline-block no-underline transition-colors hover:text-foreground",
                level === 1
                  ? "text-sm text-muted-foreground font-medium"
                  : "text-sm text-muted-foreground"
              )}
            >
              {item.title}
            </a>
            {item.items?.length ? (
              <Tree tree={item.items} level={level + 1} />
            ) : null}
          </li>
        );
      })}
    </ul>
  ) : null;
}
