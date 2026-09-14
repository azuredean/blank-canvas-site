import type { Product } from "../data";
import { cn } from "../utils/cn";

interface Props {
  product: Product;
  className?: string;
  imgClassName?: string;
}

export default function ProductVisual({ product, className, imgClassName }: Props) {
  if (product.image) {
    return (
      <div className={cn("flex items-center justify-center overflow-hidden", className)}>
        <img
          src={product.image}
          alt=""
          className={cn(
            "max-h-full max-w-full object-contain transition-transform duration-500 ease-out group-hover:-translate-y-1.5",
            imgClassName,
          )}
        />
      </div>
    );
  }
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className="capsule h-[86px] w-[26px] rounded-full transition-transform duration-500 ease-out group-hover:-translate-y-2 group-hover:rotate-[4deg] md:h-[100px] md:w-[28px]" />
    </div>
  );
}
