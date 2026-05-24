import { ComponentPropsWithoutRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";

const button = cva(
  "px-[30px] py-[4px] pb-[5px] rounded-full text-base mt-5 cursor-pointer transition-all duration-[0.35s] bg-transparent border font-sans",
  {
    variants: {
      variant: {
        primary: "text-teal border-teal hover:bg-teal hover:text-black",
        reset:
          "text-grey border-grey hover:bg-grey hover:text-black max-tablet:ml-5",
      },
    },
    defaultVariants: { variant: "primary" },
  }
);

type ButtonProps = ComponentPropsWithoutRef<"button"> &
  VariantProps<typeof button>;

export function Button({ variant, className, ...rest }: ButtonProps) {
  return <button className={clsx(button({ variant }), className)} {...rest} />;
}
