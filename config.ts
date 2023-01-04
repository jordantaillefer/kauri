import convict from "convict"
import dotenv from "dotenv"
import dotenvExpand from "dotenv-expand"
import { join } from "path"

const env = process.env.NODE_ENV ? `.${process.env.NODE_ENV}` : ""
const envPath = join(__dirname, `.env${env}`)

const envVars = dotenv.config({ path: envPath })
dotenvExpand.expand(envVars)

const config = convict({
  baseUrl: {
    format: String,
    default: "http://localhost:3000",
    env: "BASE_URL"
  },
  env: {
    doc: "The application environment.",
    format: ["production", "development", "test"],
    default: "development",
    env: "NODE_ENV"
  },
  db: {
    url: {
      format: String,
      default: "toBeSet",
      env: "DATABASE_URL"
    },
    username: {
      format: String,
      default: "toBeSet",
      env: "DATABASE_USERNAME"
    },
    password: {
      format: String,
      default: "toBeSet",
      env: "DATABASE_PASSWORD"
    },
    host: {
      format: String,
      default: "localhost",
      env: "DATABASE_HOST"
    },
    port: {
      format: Number,
      default: 5432,
      env: "DATABASE_PORT"
    },
    name: {
      format: String,
      default: "kauri",
      env: "DATABASE_NAME"
    }
  },
  authenticatorStrategy: {
    format: String,
    default: "google",
    env: "AUTHENTICATOR_STRATEGY"
  },
  google: {
    clientId: {
      format: String,
      default: "toBeSet",
      env: "GOOGLE_CLIENT_ID"
    },
    clientSecret: {
      format: String,
      default: "toBeSet",
      env: "GOOGLE_CLIENT_SECRET"
    }
  },
  sessionSecret: {
    format: String,
    default: "toBeSet",
    env: "SESSION_SECRET"
  }
})

config.validate({ allowed: "strict" })

export default config.get()