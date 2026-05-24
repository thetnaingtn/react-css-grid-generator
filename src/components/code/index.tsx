import { PropsWithChildren } from "react";

export default function Code({
  children,
  ...restProps
}: PropsWithChildren<{}>) {
  return (
    <div className="mt-[30px]" {...restProps}>
      {children}
    </div>
  );
}
