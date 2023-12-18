import { FunctionComponent } from "react"

import { Titre } from "~/ui/shared/Titre"

export const handle = {
  breadcrumb: () => ({ to: "/statistiques", label: "Mes statistiques", state: "consulter-statistique" })
}

const Planning: FunctionComponent = () => {
  return (
    <div className="px-4">
      <Titre as="h2">Mes statistiques</Titre>
    </div>
  )
}
export default Planning
