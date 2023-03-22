import type { ReactNode } from "react"

interface H2TitleProps {
  children: ReactNode
}
export function H2Title({ children }: H2TitleProps) {
  return <h2 className="text-2xl text-primary-darker font-bold mb-8">{children}</h2>
}
