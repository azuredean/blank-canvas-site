import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { getProduct, type Product } from "../data";
import ProductVisual from "./ProductVisual";

interface Props {
  onOpen: (id: string) => void;
}

const SLIDE_IDS = [
  "vozol-neon-60k",
  "jnr-hexafuse-120k",
  "elfbar-bc45000",
  "lost-mary-mt50000-turbo",
  "fumot-eco-4in1-80k",
  "vozol-star-40k",
];

const slides = SLIDE_IDS.map((id) => getProduct(id)).filter((product): product is Product => Boolean(product));

export default function Hero({ onOpen }: Props) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, []);

  const product = slides[active];
  if (!product) return null;

  const move = (direction: number) => {
    setActive((current) => (current + direction + slides.length) % slides.length);
  };

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured products"
      className="relative h-[286px] overflow-hidden rounded-[24px] bg-ink text-card shadow-[0_28px_60px_-36px_rgba(22,22,15,0.55)] md:h-[440px] md:rounded-[36px]"
    >
      <div className="grid h-full grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:grid-cols-2">
        <div className="relative z-10 flex min-w-0 flex-col justify-center px-5 pb-14 pt-5 md:px-14 md:pb-20 md:pt-12">
          <p className="truncate font-display text-[22px] font-extrabold leading-tight md:text-[50px] md:leading-[1.04]">
            {product.name}
          </p>
          <p className="mt-2 line-clamp-3 text-[10px] font-medium leading-relaxed text-card/65 md:mt-4 md:max-w-md md:text-[15px]">
            {product.desc}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onOpen(product.id)}
          aria-label={`View ${product.name}`}
          className="group relative flex min-w-0 items-center justify-center px-1 pb-11 pt-2 md:px-8 md:pb-10 md:pt-5"
        >
          <ProductVisual product={product} className="h-full w-full" imgClassName="drop-shadow-2xl" />
        </button>
      </div>

      <div className="absolute bottom-4 left-5 z-20 flex items-center gap-1.5 md:bottom-7 md:left-14 md:gap-2">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => setActive(index)}
            aria-label={`Show ${slide.name}`}
            aria-current={index === active ? "true" : undefined}
            className={`h-1.5 rounded-full transition-all md:h-2 ${index === active ? "w-6 bg-lemon md:w-8" : "w-1.5 bg-card/35 hover:bg-card/70 md:w-2"}`}
          />
        ))}
      </div>

      <div className="absolute bottom-3 right-3 z-20 flex gap-1.5 md:bottom-6 md:right-7 md:gap-2">
        <button
          type="button"
          onClick={() => move(-1)}
          aria-label="Previous featured product"
          className="grid size-8 place-items-center rounded-full border border-card/20 bg-ink/70 text-card backdrop-blur-sm transition hover:bg-card hover:text-ink md:size-10"
        >
          <ChevronLeft className="size-4 md:size-5" strokeWidth={2.2} />
        </button>
        <button
          type="button"
          onClick={() => move(1)}
          aria-label="Next featured product"
          className="grid size-8 place-items-center rounded-full border border-card/20 bg-ink/70 text-card backdrop-blur-sm transition hover:bg-card hover:text-ink md:size-10"
        >
          <ChevronRight className="size-4 md:size-5" strokeWidth={2.2} />
        </button>
      </div>
    </section>
  );
}