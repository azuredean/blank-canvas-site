import { Menu, Search } from "lucide-react";
import Wordmark from "./Wordmark";

interface Props {
  onMenu: () => void;
  onSearch: () => void;
}

export default function TopBar({ onMenu, onSearch }: Props) {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-white/85 backdrop-blur-md">
      <div className="relative mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 md:h-[72px] md:px-8">
        <button
          onClick={onMenu}
          aria-label="Open menu"
          className="grid size-10 place-items-center rounded-full text-ink transition hover:bg-paper active:scale-90"
        >
          <Menu className="size-[22px]" strokeWidth={2.4} />
        </button>

        <div className="absolute left-1/2 -translate-x-1/2">
          <Wordmark className="text-[20px] md:text-[23px]" />
        </div>

        <button
          onClick={onSearch}
          aria-label="Search products"
          className="grid size-10 place-items-center rounded-full text-ink transition hover:bg-paper active:scale-90"
        >
          <Search className="size-[21px]" strokeWidth={2.4} />
        </button>
      </div>
    </header>
  );
}
