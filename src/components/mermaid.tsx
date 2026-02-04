"use client";

import { useEffect, useState, useId } from "react";

interface MermaidProps {
  chart: string;
  className?: string;
}

export function Mermaid({ chart, className = "" }: MermaidProps) {
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const uniqueId = useId().replace(/:/g, "");

  useEffect(() => {
    let isMounted = true;

    const renderChart = async () => {
      try {
        // Dynamically import mermaid to avoid SSR issues
        const mermaid = (await import("mermaid")).default;

        // Initialize mermaid
        mermaid.initialize({
          startOnLoad: false,
          theme: "dark",
          securityLevel: "loose",
          fontFamily: "inherit",
        });

        // Generate a unique ID for each diagram
        const id = `mermaid-${uniqueId}-${Math.random().toString(36).substring(2, 9)}`;
        const { svg: renderedSvg } = await mermaid.render(id, chart.trim());

        if (isMounted) {
          setSvg(renderedSvg);
          setError(null);
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Mermaid rendering error:", err);
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to render diagram");
          setIsLoading(false);
        }
      }
    };

    renderChart();

    return () => {
      isMounted = false;
    };
  }, [chart, uniqueId]);

  if (isLoading) {
    return (
      <div className="my-6 flex justify-center rounded-lg border bg-secondary/50 p-4">
        <div className="text-muted-foreground">Loading diagram...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-6 rounded-lg border border-red-500 bg-red-500/10 p-4">
        <p className="text-sm text-red-500">Mermaid Error: {error}</p>
        <pre className="mt-2 overflow-x-auto text-xs text-muted-foreground">
          {chart}
        </pre>
      </div>
    );
  }

  return (
    <div
      className={`my-6 flex justify-center overflow-x-auto rounded-lg border bg-secondary/50 p-4 ${className}`}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
