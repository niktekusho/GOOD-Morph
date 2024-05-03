import { type HTMLProps } from "react";
import { cn } from "@/lib/utils";

export type CircularProgressProps = {
  twSize?: `size-${string}`;
};

export function CircularProgressIndicator({ twSize }: CircularProgressProps) {
  return (
    <div className="relative" role="status">
      <div className={cn("size-20 border-2 rounded-full", twSize)}></div>
      <div
        className={cn(
          "size-20 border-primary border-t-2 animate-spin rounded-full absolute left-0 top-0",
          twSize
        )}
      ></div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}
