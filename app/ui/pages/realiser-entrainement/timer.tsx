import { FunctionComponent } from "react"
import padStart from "lodash.padstart"

function presenterTempsRestant(remainingTime: number) {
  const minutes = Math.floor(remainingTime / 60)
  const seconds = remainingTime % 60

  return `${padStart(`${minutes}`, 2, "0")} m ${padStart(`${seconds}`, 2, "0")} s`
}

export const Timer: FunctionComponent<{ time: number }> = ({ time }) => {
  return <div className="flex justify-center w-full">
    <span className="border-4 border-primary p-4 text-xl text-primary w-1/2 flex justify-center rounded-lg font-bold">{presenterTempsRestant(time)}</span>
  </div>
}
