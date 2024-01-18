import { FunctionComponent } from "react"

import { Card } from "~/ui/shared/Card"

export const SeanceCard: FunctionComponent<{ name: string; description: string, active: boolean }> = ({
  description,
  name,
  active
}) => {
  return (
    <Card active={active}>
      <h5 className="block mb-2 font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
        {name}
      </h5>
      <p className="block font-sans text-base antialiased font-light leading-relaxed text-inherit">{description}</p>
    </Card>
  )
}
