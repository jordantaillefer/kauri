import * as serverModule from "@/api/index.server"
import type { LoaderFunction, MetaFunction } from "@remix-run/node"
import { json } from "@remix-run/node"
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError
} from "@remix-run/react";
import { ReasonPhrases } from "http-status-codes"
import { ReactNode } from "react"

import "./styles/tailwind.css"

export const meta: MetaFunction = () => {
  return [
    { title: "Kauri" },
    {
      property: "viewport",
      content: "width=device-width,initial-scale=1"
    }
  ]
}

interface DocumentProps {
  children: ReactNode
  title?: string
}

function Document({ children }: DocumentProps) {
  return (
    <html lang="fr" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="h-full">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export const loader: LoaderFunction = async ({ request, params, context }) => {
  const response = await serverModule.container.resolve("compteUtilisateurController").recupererCompteUtilisateurConnecte(request)
  return json({
    authenticated: response.reasonPhrase === ReasonPhrases.OK,
    user: response.data
  })
}

export default function App(): ReactNode {
  const { authenticated } = useLoaderData<{ authenticated: boolean }>()

  return (
    <Document>
      <Outlet context={{ authenticated }} />
    </Document>
  )
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}
