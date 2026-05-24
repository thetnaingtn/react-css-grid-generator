import { ComponentPropsWithoutRef } from "react";
import clsx from "clsx";

const base = "mb-0 mt-0 py-[5px] px-0 m-0 border-0";

export function Fieldset({
  className,
  ...rest
}: ComponentPropsWithoutRef<"fieldset">) {
  return <fieldset className={clsx(base, className)} {...rest} />;
}
