import type { ReactNode } from "react"

interface PrimaryButtonProps {
  children: ReactNode
  onClick: () => void
}

export function PrimaryButton({ children, onClick }: PrimaryButtonProps) {
  return (
    <button
      onClick={onClick}
      className="mr-2 mb-2 rounded-lg bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 px-5 text-center text-sm font-medium text-white shadow-lg shadow-teal-500/50 py-2.5 hover:bg-gradient-to-br focus:outline-none focus:ring-4 focus:ring-teal-300 dark:shadow-lg dark:shadow-teal-800/80 dark:focus:ring-teal-800"
    >
      {children}
    </button>
  )
}
