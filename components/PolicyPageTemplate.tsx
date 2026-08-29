import Image from "next/image";
import { PolicyToc } from "@/components/PolicyToc";
import { extractToc, injectHeadingIds } from "@/lib/toc";

const DEFAULT_BANNER_IMAGE = "/images/plan-img.webp";

export interface PolicyPageTemplateProps {
  title: string;
  subtitle?: string;
  bannerImage?: string;
  content: string;
}

/** The reusable layout behind every legal/policy page (Terms of Use,
 * Privacy Policy, Refund Policy, ...). One template, driven entirely by
 * the page's own title and its single `POLICY_CONTENT` section — no
 * policy-specific markup lives here, so a new policy page never needs a
 * code change, only a new Page row with this template selected. */
export function PolicyPageTemplate({ title, subtitle, bannerImage, content }: PolicyPageTemplateProps) {
  const toc = extractToc(content);

  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[280px] items-center justify-center overflow-hidden bg-navy-deep pt-26 pb-4 sm:min-h-[320px]">
        <Image
          src={bannerImage || DEFAULT_BANNER_IMAGE}
          alt="A commercial aircraft taking off head-on at sunset"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-deep/20 via-navy-deep/20 to-navy-deep/20" />

        <div className="content-container relative z-10 text-center">
          <h1 className="text-3xl font-semibold text-white sm:text-3xl">{title}</h1>
          {subtitle ? <p className="mt-3 text-sm font-medium uppercase tracking-[0.14em] text-white/70">{subtitle}</p> : null}
        </div>
      </section>

      {/* Content */}
      <section className="bg-white py-16 sm:py-20">
        <div className="content-container grid grid-cols-1 gap-12 lg:grid-cols-[0.8fr_2.2fr] lg:gap-16">
          <PolicyToc items={toc} />

          <div className="order-2 max-w-3xl lg:order-none">
            <article
              className="prose prose-neutral max-w-none prose-headings:font-heading prose-headings:font-semibold prose-headings:text-text-dark prose-h1:mt-12 prose-h1:text-3xl prose-h2:mt-12 prose-h2:text-2xl prose-h3:mt-8 prose-h3:text-lg prose-p:leading-relaxed prose-p:text-text-gray prose-a:text-navy-deep prose-a:underline-offset-4 prose-strong:text-text-dark prose-li:text-text-gray prose-table:text-sm first:prose-h1:mt-0 first:prose-h2:mt-0"
              // Content is authored by an RBAC-gated admin through the
              // rich-text editor (components/admin/RichTextEditor.tsx),
              // not public user input — same trust boundary as every
              // other admin-authored field in this app.
              dangerouslySetInnerHTML={{ __html: injectHeadingIds(content) }}
            />
          </div>
        </div>
      </section>
    </>
  );
}
