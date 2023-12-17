import { FunctionComponent } from "react";

import { H2Title } from "~/ui/atoms/H2Title";

export const handle = {
  breadcrumb: () => ({ to: "/chat", label: "Espace coach", state: "espace-coach" })
}
const Coach: FunctionComponent = () => {
  return (
    <div className="px-4">
      <H2Title>Espace coach</H2Title>
    </div>
  )
}
export default Coach
