import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { pageAt } from "@/lib/routes";
import { SITE } from "@/lib/site";

/* ------------------------------------------------------------------ */
/* DocumentHead                                                        */
/*                                                                     */
/* A single-page app keeps whatever <title> index.html shipped with, so */
/* all thirty-three routes were called "HashUI — React + Tailwind v4    */
/* design system". That is one title in the browser's history, one in   */
/* every bookmark, one for a search engine to index, and — the part     */
/* that actually breaks something — one announcement for a screen       */
/* reader, which reads the title on navigation and would say the same   */
/* words every time.                                                   */
/*                                                                     */
/* The docs map already holds a label and a one-line description per    */
/* route, so nothing new has to be written to fix it.                   */
/* ------------------------------------------------------------------ */

function setMeta(selector: string, attr: string, value: string) {
  const el = document.head.querySelector<HTMLMetaElement | HTMLLinkElement>(selector);
  if (el) el.setAttribute(attr, value);
}

export function DocumentHead() {
  const { pathname } = useLocation();

  useEffect(() => {
    const page = pageAt(pathname);

    const title = page ? `${page.label} — ${SITE.name}` : `${SITE.name} — ${SITE.tagline}`;
    const description = page?.desc ?? SITE.description;
    const url = `${SITE.url}${pathname === "/" ? "/" : pathname}`;

    document.title = title;
    setMeta('meta[name="description"]', "content", description);
    setMeta('meta[property="og:title"]', "content", title);
    setMeta('meta[property="og:description"]', "content", description);
    setMeta('meta[property="og:url"]', "content", url);
    setMeta('meta[name="twitter:title"]', "content", title);
    setMeta('meta[name="twitter:description"]', "content", description);
    /* a canonical that points at the page you are on, not at the site root */
    setMeta('link[rel="canonical"]', "href", url);
  }, [pathname]);

  return null;
}
