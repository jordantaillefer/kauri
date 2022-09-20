import { Strategy } from "passport-google-oauth2"
import * as passport from "passport"
import compression from "compression"
import morgan from "morgan"
import { authentificationHandler } from "api"
import type { CompteUtilisateur } from "../src/authentification/infrastructure/domain/CompteUtilisateur"
import type { NextFunction, Request, Response } from "express"
import express from "express"
import { createRequestHandler } from "@remix-run/express"
import path from "path"

const app = express()
const BUILD_DIR = path.join(process.cwd(), "build")


app.use(compression())

app.disable("x-powered-by")

app.use(
  "/build",
  express.static("public/build", { immutable: true, maxAge: "1y" })
)

app.use(express.static("public", { maxAge: "1h" }))

app.use(morgan("tiny"))


app.all(
  "*",
  process.env.NODE_ENV === "development"
    ? (req, res, next) => {
      purgeRequireCache()

      return createRequestHandler({
        build: require(BUILD_DIR),
        mode: process.env.NODE_ENV
      })(req, res, next)
    }
    : createRequestHandler({
      build: require(BUILD_DIR),
      mode: process.env.NODE_ENV
    })
)
const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Express server listening on port ${port}`)
})

function purgeRequireCache() {
  // purge require cache on requests for "server side HMR" this won't let
  // you have in-memory objects between requests in development,
  // alternatively you can set up nodemon/pm2-dev to restart the server on
  // file changes, but then you'll have to reconnect to databases/etc on each
  // change. We prefer the DX of this, so we've included it for you by default
  for (const key in require.cache) {
    if (key.startsWith(BUILD_DIR)) {
      delete require.cache[key]
    }
  }
}


app.use(passport.initialize())


passport.use(
  new Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: "http://localhost:3000/auth/google/callback", // change the domain to your domain in production
      scope: ["openid email profile"],
      passReqToCallback: true
    },
    authentificationHandler.handle
  )
)
passport.serializeUser((user, done) => {
  done(null, user)
})

// user object is the authenticated user that we get from `serializeUser` function
passport.deserializeUser((user: CompteUtilisateur, done) => {
  done(null, user)
})

app.use("/auth/google/", (req: Request, res: Response, next: NextFunction) => {
  // invoke passport authentication function with google strategy
  return passport.authenticate("google", {
    failureRedirect: "/error"
  })(req, res, next)
})

app.use("/auth/google/callback", (req: Request, res: Response, next: NextFunction) => {
  // callback from Google
  return passport.authenticate("google", {
    failureRedirect: "/error"
  })(req, res, next)
})