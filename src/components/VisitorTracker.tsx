"use client";

import { useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";

export default function VisitorTracker() {
  const pathname = usePathname();
  const lastPathRef = useRef<string>("");

  const sendHit = useCallback((payload: { path: string; eventType?: "PAGE_VIEW" | "CLICK"; eventLabel?: string }) => {
    try {
      // Do not track admin route activities
      if (pathname && pathname.startsWith("/admin")) return;

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
      const url = `${apiUrl}/api/analytics/track`;
      const bodyData = {
        path: payload.path || pathname || "/",
        referrer: typeof document !== "undefined" ? document.referrer : "",
        eventType: payload.eventType || "PAGE_VIEW",
        eventLabel: payload.eventLabel || "",
      };
      const body = JSON.stringify(bodyData);

      if (typeof fetch !== "undefined") {
        fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
          keepalive: true,
        }).catch(() => {
          // Fallback to beacon if fetch fails
          if (typeof navigator !== "undefined" && navigator.sendBeacon) {
            const blob = new Blob([body], { type: "application/json" });
            navigator.sendBeacon(url, blob);
          }
        });
      } else if (typeof navigator !== "undefined" && navigator.sendBeacon) {
        const blob = new Blob([body], { type: "application/json" });
        navigator.sendBeacon(url, blob);
      }
    } catch {
      // Fail silently to never affect user browsing experience
    }
  }, [pathname]);

  // Route change tracking
  useEffect(() => {
    if (pathname && pathname !== lastPathRef.current) {
      if (!pathname.startsWith("/admin")) {
        lastPathRef.current = pathname;
        sendHit({ path: pathname, eventType: "PAGE_VIEW" });
      }
    }
  }, [pathname, sendHit]);

  // Click event listener
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      try {
        if (pathname && pathname.startsWith("/admin")) return;

        const target = e.target as HTMLElement | null;
        if (!target) return;

        // 1. Check for explicit data-track-click attribute on element or ancestor
        const trackAttr = target.closest("[data-track-click]")?.getAttribute("data-track-click");
        if (trackAttr) {
          sendHit({ path: pathname, eventType: "CLICK", eventLabel: trackAttr });
          return;
        }

        // 2. Find closest clickable container
        const clickable = target.closest("a, button, [role='button'], input, summary, [data-clickable]") as HTMLElement | null;
        if (!clickable) return;

        // Extract label intelligently
        let label = (
          clickable.getAttribute("aria-label") ||
          clickable.title ||
          clickable.innerText ||
          ""
        ).trim();

        // If innerText/aria-label is empty (e.g. icon button), check image alt or link href
        if (!label) {
          const img = clickable.querySelector("img");
          if (img && img.alt) {
            label = img.alt;
          }
        }

        if (!label && clickable.tagName.toLowerCase() === "a") {
          const href = clickable.getAttribute("href");
          if (href) {
            if (href.startsWith("http")) {
              try {
                const parsed = new URL(href);
                label = `Link: ${parsed.hostname}${parsed.pathname}`;
              } catch {
                label = `Link: ${href}`;
              }
            } else {
              label = `Link: ${href}`;
            }
          }
        }

        // Fallback: check button id/name or title attribute of children/icons
        if (!label) {
          const svg = clickable.querySelector("svg");
          const svgTitle = svg?.querySelector("title")?.textContent;
          if (svgTitle) {
            label = svgTitle;
          } else if (clickable.id) {
            label = `Button: #${clickable.id}`;
          } else if (clickable.getAttribute("name")) {
            label = `Button: ${clickable.getAttribute("name")}`;
          } else {
            label = "Icon Button";
          }
        }

        // Clean up whitespace & truncate
        label = label.replace(/\s+/g, " ").trim().slice(0, 60);

        if (label) {
          sendHit({ path: pathname, eventType: "CLICK", eventLabel: label });
        }
      } catch {
        // Fail silently
      }
    };

    window.addEventListener("click", handleClick, { capture: true, passive: true });
    return () => {
      window.removeEventListener("click", handleClick, { capture: true });
    };
  }, [pathname, sendHit]);

  return null;
}
