import { Poppins } from "next/font/google";
import AppHeader from "@/components/layout/AppHeader";
import BootFlag from "@/components/layout/BootFlag";
import MobileTabBar from "@/components/layout/MobileTabBar";
import SkipLinks from "@/components/layout/SkipLinks";
import { GenerationProvider } from "@/context/GenerationContext";
import { ThemeProvider, themeInitScript } from "@/context/ThemeContext";
import { ToastProvider } from "@/context/ToastContext";
import { getHistory } from "@/lib/history";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata = {
  title: { default: "Fomi – AI image & video generation", template: "%s – Fomi" },
  description: "Describe what you want to create and generate images and videos with Fomi.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FBF7F4" },
    { media: "(prefers-color-scheme: dark)", color: "#141210" },
  ],
};

// The header, tab bar and generation state live here so they persist as you move between sections.
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={poppins.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <ThemeProvider>
          <ToastProvider>
            <GenerationProvider initialGenerations={getHistory()}>
              <SkipLinks />
              <div className="mx-auto flex min-h-dvh w-full max-w-[1600px] flex-col lg:h-dvh">
                <AppHeader />
                {children}
              </div>
              <MobileTabBar />
              <BootFlag />
            </GenerationProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
