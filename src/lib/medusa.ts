import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: process.env.VITE_BACKEND_URL || "/",
  debug: process.env.DEV ==="true" ,
  auth: {
    type: "session",
  },
})