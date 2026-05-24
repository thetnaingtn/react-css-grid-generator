import { ComponentPropsWithoutRef } from "react";
import clsx from "clsx";

const base =
  "text-[17px] bg-input-bg text-white w-[50px] px-[5px] py-[0.3ch] max-h-10 border border-input-border font-sans";

export function Input({
  className,
  ...rest
}: ComponentPropsWithoutRef<"input">) {
  return <input className={clsx(base, className)} {...rest} />;
}
