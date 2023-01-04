import { PlusIcon } from "@heroicons/react/24/solid"
import { ActionFunction, DataFunctionArgs, LoaderFunction } from "@remix-run/node"
import { Form, useLoaderData } from "@remix-run/react"
import { useState } from "react"
import invariant from "tiny-invariant"

import { container, ProgrammeContrat, SeanceEntrainementContrat } from "api"
import { H2Title } from "~/ui/molecules/H2Title"
import { SubmitButton } from "~/ui/molecules/SubmitButton"
import { FooterProgramme } from "~/ui/organisms/FooterProgramme"

const loaderFn: LoaderFunction = async ({ request, params }: DataFunctionArgs) => {
  invariant(params.programmeId, "expected params.programmeId")

  const programmeController = await container.resolve("programmeController")
  const seanceEntrainementController = await container.resolve("seanceEntrainementController")
  const resultProgramme = await programmeController.recupererDetail({
    request,
    payload: { idProgramme: params.programmeId }
  })

  const resultListerSeanceEntrainement = await seanceEntrainementController.listerSeanceEntrainement({
    request,
    payload: { idProgramme: params.programmeId }
  })

  return {
    programme: resultProgramme.data,
    listeSeanceEntrainement: resultListerSeanceEntrainement.data
  }
}

const actionFn: ActionFunction = async ({ request, params }: DataFunctionArgs) => {
  invariant(params.programmeId, "expected params.programmeId")
  const formData = await request.formData()
  const { _action, ...values } = Object.fromEntries(formData)

  switch (_action) {
    case "ajouter-seance": {
      await container.resolve("seanceEntrainementController").creerSeanceEntrainement({
        request,
        payload: { idProgramme: params.programmeId }
      })
      break
    }
    case "supprimer-seance": {
      if (values.selectedItemIndex) {
        await container.resolve("seanceEntrainementController").supprimerSeanceEntrainement({
          request,
          payload: { idSeanceEntrainement: values.selectedItemIndex.toString() }
        })
      }
      break
    }
  }
  return null
}

const ConsulterProgramme = () => {
  const {
    programme,
    listeSeanceEntrainement
  } = useLoaderData<{ programme: ProgrammeContrat, listeSeanceEntrainement: SeanceEntrainementContrat[] }>()

  const [selectedItemIndex, setSelectedItemIndex] = useState(0)

  return (
    <>
      <div className="container px-4 md:px-8 flex flex-col flex-grow">
        <H2Title>Programme : {programme?.nomProgramme || ""}</H2Title>

        <div className="flex mb-4">
          {
            listeSeanceEntrainement?.map((seanceEntrainement, index) => {
              return <button
                key={seanceEntrainement.id}
                onClick={() => setSelectedItemIndex(index)}
                className={`w-16 h-16 mr-2 md:mr-4 font-bold bg-primary text-white rounded-md flex justify-center items-center shadow-md ${index === selectedItemIndex ? "bg-red-900" : ""}`}>
                J{index + 1}
              </button>
            })
          }

          <Form method="post">
            <SubmitButton value="ajouter-seance">
              <PlusIcon className="h-10 w-10" />
            </SubmitButton>
          </Form>
        </div>
        <div className="flex">
          <Form method="post">
            <SubmitButton value="ajouter-exercice">
              <PlusIcon className="h-10 w-10" />
            </SubmitButton>
          </Form>
        </div>
      </div>

      <FooterProgramme selectedItemId={listeSeanceEntrainement[selectedItemIndex]?.id || ""} />
    </>

  )
}

export { actionFn, loaderFn, ConsulterProgramme }
