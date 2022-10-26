import { LoaderFunction } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"

import { container, ProgrammeContrat } from "api"
import { H2Title } from "~/ui/components/H2Title"

const loaderFn: LoaderFunction = async ({ request, params }) => {
  const programmeController = await container.resolve("programmeController")
  const result = await programmeController.recupererDetail({
    request,
    payload: { idProgramme: params.programmeId as string }
  })
  return {
    programme: result.data
  }
}

const ConsulterProgramme = () => {
  const { programme } = useLoaderData<{ programme: ProgrammeContrat }>()
  return (
    <div className="container">
      <H2Title>Création d'un nouveau programme</H2Title>
      <p>Programme : {programme ? programme.nomProgramme : ""}</p>
    </div>
  )
}

export { loaderFn, ConsulterProgramme }