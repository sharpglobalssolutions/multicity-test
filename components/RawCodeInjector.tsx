"use client";

import { useEffect } from "react";

interface RawCodeInjectorProps {
  /** Raw HTML/script snippet from the admin's Settings page (see
   * `SiteSettingsForm.tsx`) — `null`/empty is a no-op. */
  html: string | null | undefined;
  /** Where the parsed nodes land: `head` appends to `<head>`; `body-start`
   * inserts right after `<body>` opens (e.g. Google Tag Manager's
   * `<noscript>` snippet, which Google's own install instructions put
   * here, not at the end of the page); `body-end` appends just before
   * `</body>` (the common "footer scripts" slot). */
  target: "head" | "body-start" | "body-end";
}

/**
 * Injects an admin-pasted HTML/script snippet (Google Analytics, GTM, a
 * verification meta tag, etc.) into the live document, site-wide.
 *
 * This can't be done with a plain `dangerouslySetInnerHTML` wrapper: a
 * `<script>` parsed into the DOM that way never executes — the browser
 * only runs a `<script>` element when it's created and appended through
 * the DOM API, not when it arrives via `innerHTML`. So each top-level
 * `<script>` in the snippet is re-created with `document.createElement`
 * (copying its attributes/inline code) before being appended; everything
 * else (a `<noscript>`, `<meta>`, etc.) is cloned in as-is. Parsing happens
 * inside a `<template>` first, which is inert — nothing in the snippet
 * executes or loads until the recreated nodes are explicitly appended
 * below.
 */
export function RawCodeInjector({ html, target }: RawCodeInjectorProps) {
  useEffect(() => {
    const trimmed = html?.trim();
    if (!trimmed) return;

    const container = target === "head" ? document.head : document.body;
    const template = document.createElement("template");
    template.innerHTML = trimmed;

    // For `body-start`, every node inserts before this same reference
    // (captured once, before any insertion) — each new node lands right
    // before it but after whatever was already inserted, so the snippet's
    // original top-to-bottom order is preserved instead of reversed.
    const referenceNode = target === "body-start" ? container.firstChild : null;
    const place = (node: Node) => {
      if (referenceNode) {
        container.insertBefore(node, referenceNode);
      } else {
        container.appendChild(node);
      }
    };

    const inserted: Node[] = [];
    for (const node of Array.from(template.content.childNodes)) {
      if (node.nodeName === "SCRIPT") {
        const source = node as HTMLScriptElement;
        const script = document.createElement("script");
        for (const attr of Array.from(source.attributes)) {
          script.setAttribute(attr.name, attr.value);
        }
        script.text = source.textContent ?? "";
        place(script);
        inserted.push(script);
      } else {
        const clone = node.cloneNode(true);
        place(clone);
        inserted.push(clone);
      }
    }

    return () => {
      for (const node of inserted) {
        node.parentNode?.removeChild(node);
      }
    };
  }, [html, target]);

  return null;
}
