import type { ReactNode } from "react"

interface H2TitleProps {
  children: ReactNode
}
export function H2Title({ children }: H2TitleProps) {
  return <h2 className="my-4 text-2xl font-bold text-primary">{children}</h2>
}
