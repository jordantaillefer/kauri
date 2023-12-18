import clsx from "clsx"
import * as React from "react"
import { PropsWithChildren } from "react"

import { ComponentWithAs } from "~/utils/ComponentWithAs"
import { clsxm } from "~/utils/clsxm"

type TypeTitre = "h1" | "h2" | "h3" | "h4" | "h5" | "h6"

type TitreProps = PropsWithChildren<{}>

export const Titre = <T extends TypeTitre = "h1">({ as, className, ...props }: ComponentWithAs<T, TitreProps>) => {
  const Component = as || "h1"

  const defaultClasses = clsx("text-primary", "font-bold")
  const classes = clsxm(defaultClasses, className)

  return <Component {...props} className={classes} />
}
