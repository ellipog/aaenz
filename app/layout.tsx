import "./globals.css";

/**
 * Root layout — fonts and global CSS only.
 *
 * In next-intl's [locale] pattern, the <html>/<body> tags live in
 * app/[locale]/layout.tsx so the `lang` attribute can be dynamic per locale.
 * This root layout is required by Next.js but renders children unchanged.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
