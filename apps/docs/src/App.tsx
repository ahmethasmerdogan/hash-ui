import { Suspense, lazy, useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { ThemeProvider, ToastProvider, Skeleton, cx, IArrowUp } from "uicean";
import { Topbar } from "@/app/Topbar";
import { Sidebar, MobileNav } from "@/app/Sidebar";
import { CommandK } from "@/app/CommandK";
import { DocumentHead } from "@/app/DocumentHead";
import { Footer, Pager } from "@/app/Footer";
import { PAGES } from "@/lib/routes";

const Landing = lazy(() => import("@/pages/landing"));
const NotFound = lazy(() => import("@/pages/not-found"));

/* ------------------------------------------------------------------ */

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) return; // let the browser handle in-page anchors
    window.scrollTo({ top: 0 });
  }, [pathname, hash]);
  return null;
}

function PageSkeleton() {
  return (
    <div className="pt-10">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="mt-4 h-9 w-72" />
      <Skeleton className="mt-4 h-4 w-full max-w-xl" />
      <Skeleton className="mt-2 h-4 w-4/5 max-w-lg" />
      <Skeleton className="mt-10 h-56 w-full !rounded-2xl" />
      <Skeleton className="mt-6 h-56 w-full !rounded-2xl" />
    </div>
  );
}

function BackToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={cx(
        "fixed right-4 bottom-4 z-[70] flex size-10.5 items-center justify-center rounded-full border border-line bg-surface text-ink-2 transition-all duration-200 hover:text-ink",
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0",
      )}
    >
      <IArrowUp size={16} />
    </button>
  );
}

/** docs chrome: sidebar + article + pager. The landing page opts out. */
function DocsLayout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  return (
    <div className="mx-auto flex max-w-[1440px] px-4 md:px-6">
      <Sidebar />
      <main id="content" tabIndex={-1} className="min-w-0 flex-1 lg:pl-10 xl:pl-14">
        <div className="mx-auto min-w-0 max-w-4xl">
          {/* the pager goes inside the boundary: outside it, it rendered
              against the skeleton's height and was pushed down when the real
              page arrived — the whole of this route's layout shift */}
          <Suspense fallback={<PageSkeleton />}>
            {children}
            <Pager path={pathname} />
          </Suspense>
        </div>
      </main>
    </div>
  );
}

/* Thirteen tab presses stood between the top of the page and the article, on
   every route, because the header and the sidebar come first in the DOM. The
   link is visually hidden until it takes focus, which is the whole convention:
   invisible to a mouse, the first thing a keyboard finds. */
function SkipLink() {
  return (
    <a
      href="#content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-[10px] focus:border focus:border-line focus:bg-surface focus:px-4 focus:py-2.5 focus:text-[13.5px] focus:font-semibold focus:text-ink"
    >
      Skip to content
    </a>
  );
}

export default function App() {
  const [cmdOpen, setCmdOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const { pathname } = useLocation();
  const isLanding = pathname === "/";

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCmdOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <ThemeProvider>
      <ToastProvider>
        <div className="min-h-screen bg-canvas">
          <SkipLink />
          <DocumentHead />
          <ScrollToTop />
          <Topbar
            onMenu={() => setNavOpen(true)}
            onSearch={() => setCmdOpen(true)}
          />
          <MobileNav open={navOpen} onClose={() => setNavOpen(false)} />

          {isLanding ? (
            /* the landing page opts out of the docs chrome, but it still
               needs the landmark a screen reader jumps to */
            <main id="content" tabIndex={-1}>
              <Suspense fallback={<div className="min-h-[70vh]" />}>
                <Routes>
                  <Route path="/" element={<Landing />} />
                </Routes>
              </Suspense>
            </main>
          ) : (
            <DocsLayout>
              <Routes>
                {PAGES.map(({ path, Component }) => (
                  <Route key={path} path={path} element={<Component />} />
                ))}
                {/* the old single-page site linked to #anchors */}
                <Route
                  path="/docs/components"
                  element={<Navigate to="/docs/components/button" replace />}
                />
                <Route
                  path="/docs/patterns"
                  element={<Navigate to="/docs/patterns/app-shell" replace />}
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </DocsLayout>
          )}

          <Footer />
          <BackToTop />
          <CommandK open={cmdOpen} onClose={() => setCmdOpen(false)} />
        </div>
      </ToastProvider>
    </ThemeProvider>
  );
}
