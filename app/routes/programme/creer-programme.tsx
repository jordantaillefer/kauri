import { ActionFunction, redirect } from "@remix-run/node"

import { Programme } from "../../../src/programme/domain/Programme"
import { container } from "api"
import CreerProgramme from "~/ui/pages/programme/creer-programme"

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const result = await container.resolve("programmeController").creerProgramme({
    request,
    payload: { nomProgramme: formData.get("fName") as string }
  })
  const programme = result.data as Programme
  return redirect(`/programme/${programme.id}`)
}

export default CreerProgramme