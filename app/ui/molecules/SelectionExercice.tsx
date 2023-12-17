import { ExerciceContrat } from "@/api/index.server";
import { RadioGroup } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/20/solid";
import { Dispatch, FunctionComponent, SetStateAction } from "react";

export const SelectionExercice: FunctionComponent<{
  listeExerciceSelectionne: ExerciceContrat[]
  exerciceSelectionne: ExerciceContrat | null
  setExerciceSelectionne: Dispatch<SetStateAction<ExerciceContrat | null>>
}> = ({ listeExerciceSelectionne, exerciceSelectionne, setExerciceSelectionne }) => {
  return (
    <div className="w-full p-4">
      <div className="mx-auto w-full max-w-md">
        <RadioGroup value={exerciceSelectionne} onChange={setExerciceSelectionne}>
          <RadioGroup.Label className="sr-only">Server size</RadioGroup.Label>
          <div className="space-y-2">
            {listeExerciceSelectionne.map(exercice => (
              <RadioGroup.Option
                key={exercice.id}
                value={exercice}
                className={({ active, checked }) =>
                  `${active ? "ring-2 ring-white/60 ring-offset-2 ring-offset-sky-300" : ""}
                  ${checked ? "bg-sky-900/75 text-white" : "bg-white"}
                    relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none`
                }
              >
                {({ active, checked }) => (
                  <>
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center">
                        <div className="text-sm">
                          <RadioGroup.Label
                            as="p"
                            className={`font-medium  ${checked ? "text-white" : "text-gray-900"}`}
                          >
                            {exercice.nomExercice}
                          </RadioGroup.Label>
                        </div>
                      </div>
                      {checked && (
                        <div className="shrink-0 text-white">
                          <CheckIcon className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  </>
                )}
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};
