import type { ReactNode } from "react"
import { Titre } from "~/ui/atoms/Titre";

interface H2TitleProps {
  children: ReactNode
}
export function H2Title({ children }: H2TitleProps) {
  return <Titre as="h2" className="my-4 text-2xl">{children}</Titre>
}
