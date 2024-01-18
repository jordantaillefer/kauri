import { FunctionComponent } from "react";

import { Titre } from "~/ui/shared/Titre";

export const handle = {
  breadcrumb: () => ({ to: "/chat", label: "Discussions", state: "discussions" })
}
const Chat: FunctionComponent = () => {
  return (
    <div className="px-4">
      <Titre as="h2">Mes discussions</Titre>
    </div>
  )
}
export default Chat
