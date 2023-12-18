import { FunctionComponent } from "react"

import { H2Title } from "~/ui/shared/H2Title"

export const handle = {
  breadcrumb: () => ({ to: "/statistiques", label: "Mes statistiques", state: "consulter-statistique" })
}

const Planning: FunctionComponent = () => {
  return (
    <div className="px-4">
      <H2Title>Mes statistiques</H2Title>
    </div>
  )
}
export default Planning
