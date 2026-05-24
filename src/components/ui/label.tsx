import { ComponentPropsWithoutRef } from "react";
import clsx from "clsx";

const base = "pr-[18px] inline-block w-[150px] font-sans";

export function Label({
  className,
  ...rest
}: ComponentPropsWithoutRef<"label">) {
  return <label className={clsx(base, className)} {...rest} />;
}
