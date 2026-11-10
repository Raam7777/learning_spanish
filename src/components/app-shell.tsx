"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { AlphabetIcon, BookIcon, CardsIcon, HistoryIcon, LogoutIcon, SunIcon, TranslateIcon } from "@/components/icons";
import { useI18n } from "@/components/i18n-provider";
import { authClient } from "@/lib/auth-client";
import type { Dictionary } from "@/lib/i18n/dictionary";

type NavItem = Readonly<{ href: string; label: keyof Dictionary; Icon: typeof TranslateIcon }>;

const NAV: readonly NavItem[] = [
  { href: "/", label: "navTranslate", Icon: TranslateIcon },
  { href: "/history", label: "navHistory", Icon: HistoryIcon },
  { href: "/practice", label: "navPractice", Icon: CardsIcon },
  { href: "/alphabet", label: "navAlphabet", Icon: AlphabetIcon },
  { href: "/grammar", label: "navGrammar", Icon: BookIcon },
];

const isActive = (pathname: string, href: string): boolean =>
  href === "/" ? pathname === "/" : pathname.startsWith(href);

export function AppShell({ username, children }: { username: string; children: ReactNode }) {
  const { t, toggleLang } = useI18n();
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    await authClient.signOut();
    router.replace("/login");
    router.refresh();
  };

  return (
    <div className="mx-auto flex min-h-dvh max-w-2xl flex-col">
      <header className="sticky top-0 z-20 border-b border-line/70 bg-paper/90 backdrop-blur pt-[env(safe-area-inset-top)]">
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <SunIcon />
            <span className="spanish text-xl font-bold text-terracotta">{t.appName}</span>
          </Link>
          <div className="flex items-center gap-1.5">
            <span className="hidden text-sm text-ink-soft sm:inline">
              {t.hello}, {username}
            </span>
            <button type="button" onClick={toggleLang} className="chip font-semibold" aria-label="Language">
              {t.switchLang}
            </button>
            <button
              type="button"
              onClick={logout}
              className="grid size-10 place-items-center rounded-full text-ink-soft transition hover:bg-paper-deep"
              aria-label={t.logout}
              title={t.logout}
            >
              <LogoutIcon className="rtl:-scale-x-100" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 pt-5 pb-28">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-card/95 backdrop-blur pb-[env(safe-area-inset-bottom)]">
        <ul className="mx-auto grid max-w-2xl grid-cols-5">
          {NAV.map(({ href, label, Icon }) => {
            const active = isActive(pathname, href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`flex flex-col items-center gap-1 py-2.5 text-xs font-medium transition ${active ? "text-terracotta" : "text-ink-soft hover:text-ink"}`}
                >
                  <span className={`grid h-8 w-14 place-items-center rounded-full transition ${active ? "bg-terracotta-soft" : ""}`}>
                    <Icon />
                  </span>
                  {t[label]}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
