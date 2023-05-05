import padStart from "lodash.padstart"
import { FunctionComponent } from "react"

function presenterTempsRestant(remainingTime: number) {
  const minutes = Math.floor(remainingTime / 60)
  const seconds = remainingTime % 60

  return `${padStart(`${minutes}`, 2, "0")} m ${padStart(`${seconds}`, 2, "0")} s`
}

export const Timer: FunctionComponent<{ time: number }> = ({ time }) => {
  return (
    <div className="flex w-full justify-center">
      <span className="flex w-1/2 justify-center rounded-lg border-4 p-4 text-xl font-bold border-primary text-primary">
        {presenterTempsRestant(time)}
      </span>
    </div>
  )
}
