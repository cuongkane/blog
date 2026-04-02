#!/usr/bin/env node

/**
 * Lint MDX files for syntax issues that break the MDX compiler.
 *
 * Checks for bare `<` and `{` characters in prose (outside fenced code blocks
 * and inline code spans) that MDX would interpret as JSX/expressions.
 *
 * Usage:
 *   node scripts/lint-mdx.mjs                        # check all blog MDX files
 *   node scripts/lint-mdx.mjs src/content/blog/foo.mdx  # check specific files
 */

import { readFileSync, readdirSync } from "fs";
import { join, relative } from "path";

const BLOG_DIR = "src/content/blog";

// Get files from CLI args or default to all MDX in blog dir
const files =
  process.argv.length > 2
    ? process.argv.slice(2)
    : readdirSync(BLOG_DIR)
        .filter((f) => f.endsWith(".mdx"))
        .map((f) => join(BLOG_DIR, f));

let totalErrors = 0;

for (const file of files) {
  const content = readFileSync(file, "utf-8");
  const lines = content.split("\n");
  const errors = [];

  let inFrontmatter = false;
  let frontmatterDone = false;
  let inFencedCode = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;

    // Track YAML frontmatter (--- delimited)
    if (lineNum === 1 && line.trim() === "---") {
      inFrontmatter = true;
      continue;
    }
    if (inFrontmatter) {
      if (line.trim() === "---") {
        inFrontmatter = false;
        frontmatterDone = true;
      }
      continue;
    }

    // Track fenced code blocks (``` or ~~~)
    if (/^(`{3,}|~{3,})/.test(line.trim())) {
      inFencedCode = !inFencedCode;
      continue;
    }
    if (inFencedCode) continue;

    // Strip inline code spans before checking.
    // Handles single and double backticks: `code` and ``code with ` inside``
    const stripped = line.replace(/``[^`]*``|`[^`]*`/g, (m) =>
      " ".repeat(m.length),
    );

    // Check for bare < that looks like a JSX tag or comparison
    // Match < followed by: a letter (JSX tag), digit (<10ms), / (closing tag)
    const ltRegex = /<(?=[a-zA-Z0-9/])/g;
    let match;
    while ((match = ltRegex.exec(stripped)) !== null) {
      const col = match.index + 1;
      const context = stripped.substring(
        Math.max(0, match.index - 10),
        Math.min(stripped.length, match.index + 20),
      );
      errors.push({
        line: lineNum,
        col,
        msg: `Bare "<" in prose — MDX will parse this as JSX`,
        context: context.trim(),
      });
    }

    // Check for bare { that looks like an expression
    // Ignore { at start of line (likely markdown/list indent artifacts)
    const braceRegex = /\{/g;
    while ((match = braceRegex.exec(stripped)) !== null) {
      const col = match.index + 1;
      const context = stripped.substring(
        Math.max(0, match.index - 10),
        Math.min(stripped.length, match.index + 20),
      );
      errors.push({
        line: lineNum,
        col,
        msg: `Bare "{" in prose — MDX will parse this as a JS expression`,
        context: context.trim(),
      });
    }
  }

  if (errors.length > 0) {
    const rel = relative(process.cwd(), file);
    console.error(`\n\x1b[1m${rel}\x1b[0m`);
    for (const e of errors) {
      console.error(
        `  \x1b[31mline ${e.line}:${e.col}\x1b[0m  ${e.msg}`,
      );
      console.error(`    \x1b[2m...${e.context}...\x1b[0m`);
    }
    totalErrors += errors.length;
  }
}

if (totalErrors > 0) {
  console.error(`\n\x1b[31m✖ ${totalErrors} issue(s) found\x1b[0m`);
  console.error(
    `\nFix by escaping: use \`{"<"}\` or \`{"{"}\`, wrap in inline code \`<tag>\`, or rephrase (e.g. "<10ms" → "less than 10ms").\n`,
  );
  process.exit(1);
} else {
  console.log("\x1b[32m✓ No MDX syntax issues found\x1b[0m");
}
