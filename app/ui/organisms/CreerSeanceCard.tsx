import { PlusIcon } from "@heroicons/react/24/solid";
import { useFetcher } from "@remix-run/react";
import { FunctionComponent } from "react"

import { Card } from "~/ui/molecules/Card"

export const CreerSeanceCard: FunctionComponent = () => {
  const fetcher = useFetcher({ key: "creer-seance" })

  return (
    <Card className="p-0">
      <div className="w-full h-full">
        <fetcher.Form method="POST" className="w-full h-full">
          <input type="hidden" name="_action" value="creer-seance" />
          <button
            type="submit"
            className="flex items-center justify-center w-full h-full"
          >
            <PlusIcon className="w-10 h-10" />
          </button>
        </fetcher.Form>
      </div>
    </Card>
  )
}
