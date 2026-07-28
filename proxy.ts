import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing, localeForCountry } from "./i18n/routing";

// NOTE: Next.js 16 renamed `middleware.ts` to `proxy.ts`.
// This file was previously named `middleware.ts`.

/**
 * Session cookie marking that geolocation detection has already run this
 * browser session. No expiry → cleared when the browser closes, so a fresh
 * session always re-detects from the visitor's current location.
 *
 * We deliberately do NOT use a persistent cookie, so nothing ever "locks"
 * the language across sessions — every new session picks afresh, and the
 * user can always switch manually at any time.
 */
const SESSION_FLAG = "aaen:locale-detected";

const intlMiddleware = createMiddleware(routing);

export default function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // Only run geolocation detection on a bare visit to the root path,
  // and only once per browser session.
  const isRoot = pathname === "/" || pathname === "/no" || pathname === "/en";
  const alreadyDetected = req.cookies.get(SESSION_FLAG)?.value === "1";

  if (isRoot && !alreadyDetected) {
    // Vercel injects the visitor's country into this header in production.
    // Locally / on other hosts it's absent → we fall back to Norwegian.
    const country =
      req.headers.get("x-vercel-ip-country") ??
      req.headers.get("x-vercel-ip-country-region") ??
      null;

    const preferred = localeForCountry(country);

    // If the preferred locale differs from the root (which is Norwegian),
    // redirect to the right path. Norwegian stays at `/`.
    const wantsRedirect = preferred !== routing.defaultLocale;

    const res = wantsRedirect
      ? NextResponse.redirect(
          new URL(
            preferred === "en" ? `/en${search}` : `/${search}`,
            req.url,
          ),
        )
      : intlMiddleware(req);

    // Mark this session as detected (session cookie = no Max-Age/Expires).
    res.cookies.set(SESSION_FLAG, "1", {
      path: "/",
      sameSite: "lax",
      httpOnly: true,
    });
    return res;
  }

  return intlMiddleware(req);
}

export const config = {
  // Match all pathnames except:
  // - /api, /trpc, /_next, /_vercel (internals)
  // - /demos (standalone fictional client sites — own identity, no i18n chrome)
  // - any path containing a dot (static files in /public)
  matcher: ["/((?!api|trpc|_next|_vercel|demos|.*\\..*).*)"],
};
