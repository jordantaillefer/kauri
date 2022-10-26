import type { LoaderFunction, TypedResponse } from "@remix-run/node"
import { json } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"

import { container, ProgrammeContrat } from "api"
import { H2Title } from "~/ui/components/H2Title"

export const loader: LoaderFunction = async ({ request }): Promise<TypedResponse<ProgrammeContrat[]>> => {
  const programmeController = await container.resolve("programmeController")
  const listeDeProgrammes = await programmeController.listerProgramme({ request, payload: {} })

  return json(listeDeProgrammes.data as ProgrammeContrat[])
}

export default function Profil() {
  const listeDeProgrammes = useLoaderData<ProgrammeContrat[]>()
  return (
    <div className="container">
      <H2Title>Mon profil</H2Title>
      <main className="grid gap-16 grid-cols-responsive py-[max(5vw,_2rem)]">
        <Link to="/programme/creer-programme"
              className="grid place-items-center h-48 p-8 rounded-md bg-teal-700 bg-gradient-to-tr from-primary-lighter to-primary shadow-lg shadow-primary/50">
          Créer un nouveau programme
        </Link>
        {
          listeDeProgrammes.length &&
          listeDeProgrammes.map(programme => {
            return (
              <Link to={`/programme/${programme.id}`} key={programme.id}
                    className="grid place-items-center h-48 p-8 rounded-md bg-gray-300 shadow-lg shadow-gray-500/50">
                {programme.nomProgramme}
              </Link>
            )
          })
        }
      </main>
    </div>
  )
}