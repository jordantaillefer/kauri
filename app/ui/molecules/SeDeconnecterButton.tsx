import { UsersIcon } from "@heroicons/react/24/solid"
import { Form } from "@remix-run/react"
import React, { FunctionComponent } from "react"

export const SeDeconnecterButton: FunctionComponent = () => {
  return (
    <Form method="post" action={"/authentication/logout"}>
      <button
        type="submit"
        className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-main-kauri"
      >
        <UsersIcon className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-main-kauri" aria-hidden="true" />
        Se déconnecter
      </button>
    </Form>
  )
}
