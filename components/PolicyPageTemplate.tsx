import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { extractToc } from "@/lib/toc";

export interface PolicyPageTemplateProps {
  title: string;
  subtitle?: string;
  content: string;
}

/** The reusable layout behind every legal/policy page (Terms of Use,
 * Privacy Policy, Refund Policy, ...). One template, driven entirely by
 * the page's own title and its single `POLICY_CONTENT` section — no
 * policy-specific markup lives here, so a new policy page never needs a
 * code change, only a new Page row with this template selected. */
export function PolicyPageTemplate({ title, subtitle, content }: PolicyPageTemplateProps) {
  const toc = extractToc(content);

  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[280px] items-center justify-center overflow-hidden bg-navy-deep py-20 sm:min-h-[320px]">
        <Image
          src="/images/plan-img.webp"
          alt="A commercial aircraft taking off head-on at sunset"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-deep/80 via-navy-deep/70 to-navy-deep/85" />

        <div className="content-container relative z-10 text-center">
          <h1 className="text-3xl font-semibold text-white sm:text-5xl">{title}</h1>
          {subtitle ? <p className="mt-4 text-sm font-medium uppercase tracking-[0.14em] text-white/70">{subtitle}</p> : null}
        </div>
      </section>

      {/* Content */}
      <section className="bg-white py-16 sm:py-20">
        <div className="content-container grid grid-cols-1 gap-12 lg:grid-cols-[0.8fr_2.2fr] lg:gap-16">
          {toc.length > 0 ? (
            <nav aria-label="Table of contents" className="order-1 lg:sticky lg:top-24 lg:order-none lg:self-start">
              <p className="text-xs font-semibold uppercase tracking-wide text-text-gray">On this page</p>
              <ul className="mt-4 space-y-1 border-l border-navy-deep/10">
                {toc.map((item) => (
                  <li key={item.slug}>
                    <Link
                      href={`#${item.slug}`}
                      className={`block border-l-2 border-transparent py-1.5 text-sm text-text-gray transition-colors hover:border-navy-deep/40 hover:text-navy-deep ${
                        item.level === 3 ? "pl-8" : "pl-4"
                      }`}
                    >
                      {item.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}

          <div className="order-2 max-w-3xl lg:order-none">
            <article className="prose prose-neutral max-w-none prose-headings:font-heading prose-headings:font-semibold prose-headings:text-text-dark prose-h2:mt-12 prose-h2:text-2xl prose-h3:mt-8 prose-h3:text-lg prose-p:leading-relaxed prose-p:text-text-gray prose-a:text-navy-deep prose-a:underline-offset-4 prose-strong:text-text-dark prose-li:text-text-gray first:prose-h2:mt-0">
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSlug]}>
                {content}
              </ReactMarkdown>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
