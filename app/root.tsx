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
  useLocation,
  useOutletContext
} from "@remix-run/react"
import styles from "./styles/styles.css"
import * as React from "react"
import { RootLayout } from "~/ui/RootLayout"
import { authenticator } from "~/services/auth.server"

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
  children: React.ReactNode;
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
    <body className="bg-gray-100">
    {children}
    <RouteChangeAnnouncement />
    <ScrollRestoration />
    <Scripts />
    {process.env.NODE_ENV === "development" && <LiveReload />}
    </body>
    </html>
  )
}

export const loader: LoaderFunction = async ({ request }) => {
  let user = await authenticator.isAuthenticated(request)
  return json({
    authenticated: !!user
  })
}


export default function App(): React.ReactNode {
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

const RouteChangeAnnouncement = React.memo(function RouteChangeAnnouncement() {
  let [hydrated, setHydrated] = React.useState(false)
  let [innerHtml, setInnerHtml] = React.useState("")
  let location = useLocation()

  React.useEffect(() => {
    setHydrated(true)
  }, [])

  let firstRenderRef = React.useRef(true)
  React.useEffect(() => {
    // Skip the first render because we don't want an announcement on the
    // initial page load.
    if (firstRenderRef.current) {
      firstRenderRef.current = false
      return
    }

    let pageTitle = location.pathname === "/" ? "Home page" : document.title
    setInnerHtml(`Navigated to ${pageTitle}`)
  }, [location.pathname])

  // Render nothing on the server. The live region provides no value unless
  // scripts are loaded and the browser takes over normal routing.
  if (!hydrated) {
    return null
  }

  return (
    <div
      aria-live="assertive"
      aria-atomic
      id="route-change-region"
      style={{
        border: "0",
        clipPath: "inset(100%)",
        clip: "rect(0 0 0 0)",
        height: "1px",
        margin: "-1px",
        overflow: "hidden",
        padding: "0",
        position: "absolute",
        width: "1px",
        whiteSpace: "nowrap",
        wordWrap: "normal"
      }}
    >{innerHtml}</div>
  )
})
