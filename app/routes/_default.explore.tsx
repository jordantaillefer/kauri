import { FunctionComponent } from "react"

import { H2Title } from "~/ui/atoms/H2Title"

export const handle = {
  breadcrumb: () => ({ to: "/explore", label: "Explorer les programmes", state: "explorer-programme" })
}
const Explore: FunctionComponent = () => {
  return (
    <div className="px-4">
      <H2Title>Découvrir des programmes de la communautés</H2Title>
    </div>
  )
}
export default Explore
