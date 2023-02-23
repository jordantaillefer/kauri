import { Form } from "@remix-run/react"
import * as React from "react"

export function SeDeconnecterButton() {
  return (
    <Form className="inline-flex justify-center" method="post" action={`/logout`}>
      <button
        className="inline-block rounded-full bg-danger p-2 md:px-6 md:pt-2.5 md:pb-2 md:text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]">
        <img className="md:hidden w-4" src="/assets/icons/account.png" alt="Se connecter" />
        <span className="hidden md:block">Se déconnecter</span>
      </button>
    </Form>
  )
}