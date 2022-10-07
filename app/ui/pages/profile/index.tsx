import type { LoaderFunction, TypedResponse } from "@remix-run/node"
import { json } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"

import { H2Title } from "~/ui/components/H2Title"

type Programme = {
  id: number
  name: string
}

export const loader: LoaderFunction = async ({ request }): Promise<TypedResponse<Programme[]>> => {
  return json([
      {
        id: 1,
        name: "tota"
      },
      {
        id: 2,
        name: "tote"
      },
      {
        id: 3,
        name: "toti"
      },
      {
        id: 4,
        name: "toto"
      },
      {
        id: 5,
        name: "totu"
      },
      {
        id: 6,
        name: "toty"
      }
    ]
  )
}

export default function Profile() {
  const listeDeProgrammes = useLoaderData<Programme[]>()
  return (
    <div className="container mx-auto">
      <H2Title>Mon profile</H2Title>
      <main className="grid gap-16 grid-cols-responsive py-[max(5vw,_2rem)]">
        <Link to="/programme/creer-programme"
              className="grid place-items-center h-48 p-8 rounded-md bg-teal-700 bg-gradient-to-tr from-primary-lighter to-primary shadow-lg shadow-primary/50">
          Créer un nouveau programme
        </Link>
        {
          listeDeProgrammes.map(programme => {
            return (
              <Link to={`/programme/${programme.id}`} key={programme.id}
                    className="grid place-items-center h-48 p-8 rounded-md bg-gray-300 shadow-lg shadow-gray-500/50">
                {programme.name}
              </Link>
            )
          })
        }
      </main>
    </div>
  )
}