import Composer from "@/components/composer/Composer";
import MobileComposer from "@/components/composer/MobileComposer";
import GenerationFeed from "@/components/feed/GenerationFeed";
import HistoryStrip from "@/components/history/HistoryStrip";
import Hotkeys from "@/components/layout/Hotkeys";

export default function Home() {
  return (
    <>
      {/* Sticks just under the header (52px on mobile, 72px from md up). */}
      <div className="sticky top-[52px] z-30 bg-bg/85 pb-3 backdrop-blur-md md:top-[72px]">
        <HistoryStrip />
      </div>
      {/* Below md the docked composer (~64px) and tab bar (56px) sit at the bottom, so reserve their height. */}
      <div className="flex min-h-0 flex-1 flex-col gap-4 px-4 pb-[calc(8.5rem+env(safe-area-inset-bottom))] md:px-6 md:pb-4 lg:flex-row">
        <Composer />
        <GenerationFeed />
      </div>
      <MobileComposer />
      <Hotkeys />
    </>
  );
}
