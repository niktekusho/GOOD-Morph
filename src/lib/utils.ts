import { type ClassValue, clsx } from "clsx";
import { useRef } from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function useRenderCount(component: string) {
  const ref = useRef(0);
  ref.current++;

  if (process.env.NODE_ENV !== "production") {
    const info = {
      component,
      renderCount: ref.current,
    };

    // console.log(info);

    return info;
  }
}
