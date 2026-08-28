import GithubSlugger from "github-slugger";

export interface TocItem {
  level: 2 | 3;
  text: string;
  slug: string;
}

/** Extracts H2/H3 headings from raw markdown for the policy page's table
 * of contents. Uses `github-slugger` — the same slugger `rehype-slug`
 * uses to id-tag the rendered headings — with a fresh instance per call,
 * so as long as both this and the render pass walk the same document
 * top-to-bottom (they do), duplicate-heading suffixes (`-1`, `-2`, ...)
 * land identically and TOC links always resolve to the right anchor. */
export function extractToc(markdown: string): TocItem[] {
  const slugger = new GithubSlugger();
  const items: TocItem[] = [];
  const headingPattern = /^(#{2,3})\s+(.+)$/gm;

  let match: RegExpExecArray | null;
  while ((match = headingPattern.exec(markdown)) !== null) {
    const level = match[1]!.length === 2 ? 2 : 3;
    const text = match[2]!.trim();
    items.push({ level, text, slug: slugger.slug(text) });
  }

  return items;
}
