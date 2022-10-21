import type { LoaderFunction } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react" // or cloudflare/deno

export const loader: LoaderFunction = async ({ params}) => {
  return {
    programmeId: params.programmeId
  }
}

export default function DetailProgramme() {
  const loaderData = useLoaderData()
  return (
    <div className="container mx-auto">
      <h2>Programme id : { loaderData.programmeId }</h2>
    </div>
  )
}