import type { Metadata, Viewport } from "next";
import { Fraunces, Rubik } from "next/font/google";
import { I18nProvider } from "@/components/i18n-provider";
import { SpeechProvider } from "@/components/speech-provider";
import { dirOf } from "@/lib/i18n/dictionary";
import { getServerLang } from "@/lib/i18n/server";
import "./globals.css";

const rubik = Rubik({ subsets: ["latin", "hebrew"], variable: "--font-rubik", display: "swap" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap" });

export const metadata: Metadata = {
  title: "Che Español · ספרדית ארגנטינאית",
  description: "Learn Buenos Aires Spanish from Hebrew or English",
  applicationName: "Che Español",
  appleWebApp: { capable: true, title: "Che Español", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: "#fbf6ec",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const lang = await getServerLang();
  return (
    <html lang={lang} dir={dirOf(lang)} className={`${rubik.variable} ${fraunces.variable}`}>
      <body className="antialiased">
        <I18nProvider initialLang={lang}>
          <SpeechProvider>{children}</SpeechProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
