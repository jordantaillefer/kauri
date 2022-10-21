import { createCookieSessionStorage, Session } from "@remix-run/node"

import config from "../../config"

export let sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "_session", // use any name you want here
    sameSite: "lax", // this helps with CSRF
    path: "/", // remember to add this so the cookie will work in all routes
    httpOnly: true, // for security reasons, make this cookie http only
    secrets: [config.sessionSecret], // replace this with an actual secret
    secure: config.env === "production" // enable this in prod only
  }
})

export class SessionManager {
  async get(request: Request) {
    return sessionStorage.getSession(request.headers.get("Cookie"))
  }

  async commitSession(session: Session) {
    return sessionStorage.commitSession(session)
  }

  async destroySession(request: Request) {
    let session = await sessionStorage.getSession(request.headers.get("Cookie"))
    return sessionStorage.destroySession(session)
  }
}