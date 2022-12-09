import type { LoaderFunction, TypedResponse } from "@remix-run/node"
import { json } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"

import { container, ProgrammeContrat } from "api"
import { H2Title } from "~/ui/molecules/H2Title"

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
      <main className="grid gap-[var(--gap)] grid-cols-responsive py-[max(5vw,_2rem)]">
        <Link to="/programme/creer-programme"
              className="grid place-items-center h-48 p-8 rounded-md bg-teal-700 bg-gradient-to-tr from-primary-lighter to-primary shadow-lg shadow-primary/50">
          Créer un nouveau programme
        </Link>
        {
          listeDeProgrammes.length &&
          listeDeProgrammes.map(programme => {
            /*
  */
            return (
              <Link to={`/programme/${programme.id}`} key={programme.id}
                    className="group flex flex-col h-[20rem] min-w-[20rem] overflow-hidden rounded-md bg-white p-8 shadow-lg transition duration-200 ease-linear hover:scale-[1.02] hover:bg-primary">
                <h3 className="text-primary text-xl font-semibold leading-none pb-2 mb-4 border-b-2 border-solid border-gray-400 transition duration-200 ease-linear group-hover:border-white group-hover:text-white">{programme.nomProgramme}</h3>
                <h4 className="text-primary-darker text-xl font-semibold mb-4 leading-none transition duration-200 ease-linear group-hover:text-white">Nombre de séance : 4</h4>
                <p className="text-primary-darker leading-relaxed mb-5 transition duration-200 ease-linear group-hover:text-white">Programme en PPL se concentrant sur l'hypertrophie.</p>
                <span className="flex text-primary text-xl leading-none mt-auto transition duration-200 ease-linear group-hover:text-white">
                  Voir le programme
                  <svg width="25" height="16" viewBox="0 0 25 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="mt-auto ml-4 transition-transform duration-200 ease-linear">
            <path className="transition-fill duration-200 ease-linear" fill-rule="evenodd" clip-rule="evenodd"
                  d="M17.8631 0.929124L24.2271 7.29308C24.6176 7.68361 24.6176 8.31677 24.2271 8.7073L17.8631 15.0713C17.4726 15.4618 16.8394 15.4618 16.4489 15.0713C16.0584 14.6807 16.0584 14.0476 16.4489 13.657L21.1058 9.00019H0.47998V7.00019H21.1058L16.4489 2.34334C16.0584 1.95281 16.0584 1.31965 16.4489 0.929124C16.8394 0.538599 17.4726 0.538599 17.8631 0.929124Z"
                  fill="#753BBD" />
            </svg>
                </span>
              </Link>
            )
          })
        }
      </main>
    </div>
  )
}