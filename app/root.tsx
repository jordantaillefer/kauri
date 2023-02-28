import type { LinksFunction, LoaderFunction, MetaFunction } from "@remix-run/node"
import { json } from "@remix-run/node"
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useOutletContext
} from "@remix-run/react"
import { ReasonPhrases } from "http-status-codes"
import { ReactNode } from "react"

import styles from "./styles/styles.css"
import { container } from "api"
import { RootLayout } from "~/ui/RootLayout"

type ContextType = { authenticated: boolean };

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: styles }
  ]
}

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Kauri",
  viewport: "width=device-width,initial-scale=1"
})

interface DocumentProps {
  children: ReactNode;
  title?: string;
}

function Document({ children }: DocumentProps) {
  return (
    <html lang="fr">
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <Meta />
      <Links />
    </head>
    <body>
    {children}
    <ScrollRestoration />
    <Scripts />
    {process.env.NODE_ENV === "development" && <LiveReload />}
    </body>
    </html>
  )
}

export const loader: LoaderFunction = async ({ request }) => {
  let response = await container.resolve("compteUtilisateurController").recupererCompteUtilisateurConnecte(request)
  return json({
    authenticated: response.reasonPhrase === ReasonPhrases.OK
  })
}

export default function App(): ReactNode {
  const { authenticated } = useLoaderData<{ authenticated: boolean }>()

  return (
    <Document>
      <RootLayout authenticated={authenticated}>
        <Outlet context={{ authenticated }} />
      </RootLayout>
    </Document>
  )
}

export function useAuthenticated() {
  return useOutletContext<ContextType>()
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.log(error)
}
