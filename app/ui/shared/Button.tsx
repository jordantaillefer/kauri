import clsx from "clsx"
import type { FunctionComponent, PropsWithChildren } from "react"
import * as React from "react"

import { clsxm } from "~/utils/clsxm"

type PrimaryButtonProps = PropsWithChildren<{}> & React.ButtonHTMLAttributes<HTMLButtonElement>

export const Button: FunctionComponent<PrimaryButtonProps> = ({ className, ...props }) => {
  const defaultClasses = clsx(
    "bg-primary",
    "mx-2 px-5 py-2.5",
    "rounded-lg",
    "text-sm font-medium text-center text-white",
    "shadow-lg"
  )
  const classes = clsxm(defaultClasses, className)

  return <button {...props} className={classes} />
}
