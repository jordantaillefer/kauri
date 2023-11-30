import clsx from "clsx"
import { FunctionComponent, HTMLAttributes, PropsWithChildren } from "react";

import { clsxm } from "~/utils/clsxm"

type CardProps = PropsWithChildren<{ active?: boolean }> & HTMLAttributes<HTMLDivElement>

export const Card: FunctionComponent<CardProps> = ({ active = false, className, ...props }) => {
  const defaultClasses = clsx(
    "bg-white",
    "relative",
    "rounded-lg",
    "flex",
    "items-center",
    "shadow",
    "hover:border-gray-400 hover:shadow-lg",
    "px-6 py-5",
    "min-h-[6rem]",
    active && "ring-2 ring-indigo-500 ring-offset-2",
  )
  const classes = clsxm(defaultClasses, className)

  return <div { ...props } className={classes}  />
}
