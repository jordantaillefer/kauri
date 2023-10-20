import type * as React from "react"

type PropsWithAs<T extends React.ElementType, U> = { as?: T } & U
export type ComponentWithAs<T extends React.ElementType, U> = PropsWithAs<T, U> &
  Omit<React.ComponentPropsWithoutRef<T>, keyof PropsWithAs<T, U>>
