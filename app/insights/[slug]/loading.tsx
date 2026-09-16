/** Next.js's automatic route-level loading UI — shown while the blog
 * post + related posts + FAQs fetch (see `app/insights/[slug]/page.tsx`,
 * `dynamic = "force-dynamic"`). No Header/Footer here: this replaces only
 * the page body during navigation, then the real page (which renders its
 * own Header/Footer) takes over once data resolves. */
export default function BlogPostLoading() {
  return (
    <div className="animate-pulse bg-off-white pt-28 pb-10 sm:pt-32 sm:pb-12">
      <div className="content-container max-w-4xl text-center">
        <div className="mx-auto h-9 w-3/4 rounded bg-gray-light sm:h-10" />
        <div className="mx-auto mt-4 h-5 w-2/3 rounded bg-gray-light" />
      </div>
      <div className="content-container mt-10">
        <div className="aspect-[16/7] w-full rounded-2xl bg-gray-light sm:aspect-[16/8]" />
      </div>
      <div className="content-container mt-12 grid grid-cols-1 gap-12 lg:grid-cols-[70%_1fr]">
        <div className="space-y-4">
          <div className="h-4 w-full rounded bg-gray-light" />
          <div className="h-4 w-full rounded bg-gray-light" />
          <div className="h-4 w-5/6 rounded bg-gray-light" />
        </div>
        <div className="h-48 rounded-card bg-gray-light" />
      </div>
    </div>
  );
}
