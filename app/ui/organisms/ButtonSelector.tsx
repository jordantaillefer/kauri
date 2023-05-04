import { Link } from "@remix-run/react"
import { RemixLinkProps } from "@remix-run/react/dist/components"
import clsx from "clsx"
import * as React from "react"
import { PropsWithChildren } from "react"

import { clsxm } from "~/utils/clsxm"

type SelectorButtonProps = PropsWithChildren<{ active: boolean }> &
  RemixLinkProps &
  React.RefAttributes<HTMLAnchorElement>
export const ButtonSelector = ({ active, className, ...props }: SelectorButtonProps) => {
  const defaultClasses = clsx(
    "text-primary text-sm",
    "border-2 border-primary rounded-full",
    "px-3 py-1",
    "shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]",
    { "bg-primary text-white": active }
  )
  const classes = clsxm(defaultClasses, className)

  return (
    <Link {...props} className={classes}>
      {props.children}
    </Link>
  )
}
