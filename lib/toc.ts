import GithubSlugger from "github-slugger";

export interface TocItem {
  level: 1 | 2 | 3;
  text: string;
  slug: string;
}

const HEADING_PATTERN = /<h([123])([^>]*)>([\s\S]*?)<\/h\1>/gi;

function stripTags(html: string): string {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0*39;/g, "'")
    .trim();
}

/** Extracts H1/H2/H3 headings from the policy content's HTML (produced by
 * the admin's rich-text editor, see `components/admin/RichTextEditor.tsx`)
 * for the table of contents. Uses a fresh `github-slugger` instance per
 * call — the same slugger `injectHeadingIds` below uses — so as long as
 * both walk the same document top-to-bottom in the same order (they do,
 * via the same regex), duplicate-heading suffixes (`-1`, `-2`, ...) land
 * identically and TOC links always resolve to the right anchor. */
export function extractToc(html: string): TocItem[] {
  const slugger = new GithubSlugger();
  const items: TocItem[] = [];

  let match: RegExpExecArray | null;
  HEADING_PATTERN.lastIndex = 0;
  while ((match = HEADING_PATTERN.exec(html)) !== null) {
    const level = Number(match[1]) as 1 | 2 | 3;
    const text = stripTags(match[3]!);
    if (!text) continue;
    items.push({ level, text, slug: slugger.slug(text) });
  }

  return items;
}

/** Injects an `id` attribute into every H1/H2/H3 tag in `html`, in
 * document order, so the table of contents' anchor links (`#slug`)
 * actually scroll to the right section. */
export function injectHeadingIds(html: string): string {
  const slugger = new GithubSlugger();
  HEADING_PATTERN.lastIndex = 0;
  return html.replace(HEADING_PATTERN, (full, level: string, attrs: string, inner: string) => {
    const text = stripTags(inner);
    if (!text) return full;
    const slug = slugger.slug(text);
    return `<h${level}${attrs} id="${slug}">${inner}</h${level}>`;
  });
}
