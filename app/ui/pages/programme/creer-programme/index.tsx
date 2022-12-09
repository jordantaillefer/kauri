import { ActionFunction, redirect } from "@remix-run/node"
import { useFetcher } from "@remix-run/react"

import { Programme } from "../../../../../src/entrainement/domain/Programme"
import { container } from "api"
import { H2Title } from "~/ui/molecules/H2Title"
import { SubmitButton } from "~/ui/molecules/SubmitButton"

const actionFn: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const result = await container.resolve("programmeController").creerProgramme({
    request,
    payload: { nomProgramme: formData.get("nomProgramme") as string }
  })
  const programme = result.data as Programme
  return redirect(`/programme/${programme.id}`)
}

const CreerProgramme = () => {
  const creerProgramme = useFetcher<{ nomProgramme: string }>()

  return (
    <div className="container px-4 md:px-8">
      <H2Title>Création d'un nouveau programme</H2Title>
      <creerProgramme.Form method="post">
        <div className="mb-5">
          <input
            type="text"
            name="nomProgramme"
            id="nomProgramme"
            placeholder="Nom du programme"
            className="w-full rounded-md border border-gray bg-white py-3 px-6 text-base font-medium text-gray-darker outline-none focus:border-primary focus:shadow-md"
          />
        </div>

        <SubmitButton>Créer le programme</SubmitButton>
      </creerProgramme.Form>
    </div>
  )
}

export { CreerProgramme, actionFn }