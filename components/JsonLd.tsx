/** Renders an admin-authored JSON-LD structured-data block (see
 * `PageSeoCard.tsx`'s "Schema markup" field) as an inert
 * `application/ld+json` `<script>` — unlike an executable script, this
 * type is never run by the browser, so `dangerouslySetInnerHTML` is safe
 * here without `RawCodeInjector`'s script-recreation trick. */
export function JsonLd({ data }: { data: unknown }) {
  if (!data) return null;
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
