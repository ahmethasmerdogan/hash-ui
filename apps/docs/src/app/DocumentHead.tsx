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

/* robots is absent from index.html — it only exists on the routes that need
   it, so it is created and removed rather than rewritten */
function setRobots(value: string | null) {
  let el = document.head.querySelector<HTMLMetaElement>('meta[name="robots"]');
  if (value === null) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement("meta");
    el.name = "robots";
    document.head.appendChild(el);
  }
  el.content = value;
}

export function DocumentHead() {
  const { pathname } = useLocation();

  useEffect(() => {
    const page = pageAt(pathname);
    /* every path that is neither the landing page nor a documented route
       renders the 404 page, and should be labelled as one — the tab, the
       history entry and the screen-reader announcement all said "HashUI —
       A design foundation" before, which is the landing page's title */
    const missing = !page && pathname !== "/";

    const title = missing
      ? `Page not found — ${SITE.name}`
      : page
        ? `${page.label} — ${SITE.name}`
        : `${SITE.name} — ${SITE.tagline}`;
    const description = missing
      ? "That page does not exist. Search the docs, or start from the beginning."
      : (page?.desc ?? SITE.description);
    /* a 404 that declares itself canonical is asking to be indexed as a real
       page; point at the docs root instead and mark it noindex */
    const url = missing ? `${SITE.url}/docs` : `${SITE.url}${pathname === "/" ? "/" : pathname}`;
    setRobots(missing ? "noindex, follow" : null);

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
