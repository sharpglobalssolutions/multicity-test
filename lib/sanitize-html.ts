import "server-only";
import sanitizeHtmlLib from "sanitize-html";
import { SECTION_FIELD_SCHEMAS } from "@/lib/section-field-schemas";
import type { SectionType } from "@/types/page-sections";

/**
 * The HTML surface `components/admin/RichTextEditor.tsx` can actually
 * produce (Tiptap's `StarterKit` + the Table extensions it configures),
 * plus `img` for defense-in-depth even though the editor has no image
 * insertion UI today — an admin can still hand-type HTML via the editor's
 * "HTML" source tab, and that's exactly the path this sanitizer exists to
 * constrain. Anything outside this list (most importantly `script`,
 * `style`, `iframe`, and any `on*` event-handler attribute) is stripped.
 */
const ALLOWED_TAGS = [
  "p",
  "br",
  "hr",
  "strong",
  "b",
  "em",
  "i",
  "s",
  "strike",
  "u",
  "code",
  "pre",
  "blockquote",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "ul",
  "ol",
  "li",
  "a",
  "img",
  "table",
  "thead",
  "tbody",
  "tr",
  "th",
  "td",
];

const ALLOWED_ATTRIBUTES: sanitizeHtmlLib.IOptions["allowedAttributes"] = {
  a: ["href", "target", "rel"],
  img: ["src", "alt", "width", "height"],
  th: ["colspan", "rowspan"],
  td: ["colspan", "rowspan"],
};

/**
 * Strips any tag/attribute outside the rich-text editor's own output
 * surface — most importantly `<script>`, inline event handlers
 * (`onerror`, `onclick`, ...) and `javascript:`/`data:` URLs — before
 * admin-authored HTML is persisted. This content is later rendered with
 * `dangerouslySetInnerHTML` (see `BlogDetailTemplate`, `PolicyPageTemplate`,
 * and every section component fed from CMS `richtext` fields), so a
 * compromised or malicious admin/editor account should not be able to
 * store a payload that executes in every visitor's browser. Safe to run
 * on a plain-text string too — with no HTML tags present, it's returned
 * unchanged.
 */
export function sanitizeRichText(html: string): string {
  return sanitizeHtmlLib(html, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: ALLOWED_ATTRIBUTES,
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowProtocolRelative: false,
    transformTags: {
      a: sanitizeHtmlLib.simpleTransform("a", { rel: "noopener noreferrer" }),
    },
  });
}

/**
 * Sanitizes only the fields `SECTION_FIELD_SCHEMAS` marks as `"richtext"`
 * within a page section's freeform `data` JSON (including `"richtext"`
 * fields nested inside a `"list"` field's items) — every other field (a
 * URL, an id, a plain label) is left untouched, since running an HTML
 * sanitizer over a non-HTML string like `"/foo?a=1&b=2"` would mangle it
 * (the `&` gets re-encoded on serialization). Unknown section types (or
 * ones with no field schema) pass through unchanged.
 */
export function sanitizeSectionData(
  sectionType: SectionType,
  data: Record<string, unknown>,
): Record<string, unknown> {
  const fields = SECTION_FIELD_SCHEMAS[sectionType];
  if (!fields) return data;

  const result: Record<string, unknown> = { ...data };

  for (const field of fields) {
    if (field.kind === "richtext") {
      const value = result[field.key];
      if (typeof value === "string") {
        result[field.key] = sanitizeRichText(value);
      }
      continue;
    }

    if (field.kind === "list") {
      const richtextKeys = field.itemFields.filter((itemField) => itemField.kind === "richtext").map((f) => f.key);
      if (richtextKeys.length === 0) continue;

      const items = result[field.key];
      if (!Array.isArray(items)) continue;

      result[field.key] = items.map((item) => {
        if (!item || typeof item !== "object") return item;
        const sanitizedItem: Record<string, unknown> = { ...(item as Record<string, unknown>) };
        for (const key of richtextKeys) {
          if (typeof sanitizedItem[key] === "string") {
            sanitizedItem[key] = sanitizeRichText(sanitizedItem[key] as string);
          }
        }
        return sanitizedItem;
      });
    }
  }

  return result;
}
