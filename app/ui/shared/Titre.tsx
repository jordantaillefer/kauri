import clsx from "clsx"
import * as React from "react"
import { PropsWithChildren } from "react"

import { ComponentWithAs } from "~/utils/ComponentWithAs"
import { clsxm } from "~/utils/clsxm"

type TypeTitre = "h1" | "h2" | "h3" | "h4" | "h5" | "h6"

type TitreProps = PropsWithChildren<{}>

const titreClasse: Record<TypeTitre, string> = {
  "h1": "my-2 text-2xl",
  "h2": "my-4 text-2xl",
  "h3": "my-4 text-2xl",
  "h4": "my-4 text-2xl",
  "h5": "my-4 text-2xl",
  "h6": "my-4 text-2xl",
}

export const Titre = <T extends TypeTitre = "h1">({ as, className, ...props }: ComponentWithAs<T, TitreProps>) => {
  const Component = as || "h1"

  const defaultClasses = clsx("text-primary", "font-bold", titreClasse[Component])
  const classes = clsxm(defaultClasses, className)

  return <Component {...props} className={classes} />
}
