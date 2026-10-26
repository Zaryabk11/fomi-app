import { Headphones, LayoutGrid } from "lucide-react";
import Button from "@/components/ui/Button";
import ThemeToggle from "@/components/ui/ThemeToggle";
import AvatarMenu from "./AvatarMenu";

// Gallery and Support: icon-only on tablet, labelled on desktop, and moved into the avatar menu on mobile.
export default function HeaderActions() {
  return (
    <div className="flex items-center justify-end gap-2">
      <Button icon={LayoutGrid} aria-label="Gallery" title="Gallery" className="hidden md:inline-flex">
        <span className="hidden lg:inline">Gallery</span>
      </Button>
      <Button icon={Headphones} aria-label="Support" title="Support" className="hidden md:inline-flex">
        <span className="hidden lg:inline">Support</span>
      </Button>
      <ThemeToggle />
      <AvatarMenu />
    </div>
  );
}
