import { LoaderFunction } from "@remix-run/node"
import { FunctionComponent } from "react"
import invariant from "tiny-invariant"

import { H2Title } from "~/ui/atoms/H2Title"

export const loader: LoaderFunction = ({ params }) => {
  invariant(params.idSeance, "expected params.idSeance")

}
export const ResumeSeanceEntrainement: FunctionComponent = () => {
  return (
    <div className="container">
      <H2Title>Résumé de la séance</H2Title>
    </div>
  )
}