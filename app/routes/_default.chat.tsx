import { FunctionComponent } from "react";

import { H2Title } from "~/ui/atoms/H2Title";

export const handle = {
  breadcrumb: () => ({ to: "/chat", label: "Discussions", state: "discussions" })
}
const Chat: FunctionComponent = () => {
  return (
    <div className="px-4">
      <H2Title>Mes discussions</H2Title>
    </div>
  )
}
export default Chat
