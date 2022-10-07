import type { ActionFunction } from "@remix-run/node"
import { redirect } from "@remix-run/node"
import { Form } from "@remix-run/react"

import { container } from "api"
import { H2Title } from "~/ui/components/H2Title"
import { PrimaryButton } from "~/ui/components/PrimaryButton"

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const project = await container.resolve("programmeController").creerProgramme(formData)
  return redirect(`/projects/${project.id}`)
}

function CreerProgramme() {
  return (
    <div className="container mx-auto">
      <H2Title>Création d'un nouveau programme</H2Title>
      <Form method="post" action="programme/creer-programme">
        <div className="mb-5">
          <input
            type="text"
            name="fName"
            id="fName"
            placeholder="Nom du programme"
            className="w-full rounded-md border border-gray bg-white py-3 px-6 text-base font-medium text-gray-darker outline-none focus:border-primary focus:shadow-md"
          />
        </div>

        <PrimaryButton>Créer le programme</PrimaryButton>
      </Form>
    </div>
  )
}

export default CreerProgramme