import Link from "next/link";
import HeaderActions from "./HeaderActions";
import PrimaryNav from "./PrimaryNav";

export default function AppHeader() {
  return (
    <header className="boot animate-fade-in sticky top-0 z-30 flex h-[52px] items-center justify-between gap-4 bg-bg/85 px-4 pb-2 pt-3 backdrop-blur-md md:grid md:h-[72px] md:grid-cols-[1fr_auto_1fr] md:px-6 md:pt-4">
      <h1 className="sr-only">Fomi: create images and videos with AI</h1>
      <Link href="/" aria-label="Fomi home" className="w-fit text-2xl font-semibold leading-none text-ink">
        F
      </Link>
      <PrimaryNav />
      <HeaderActions />
    </header>
  );
}
