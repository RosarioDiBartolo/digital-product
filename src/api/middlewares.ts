import { 
  validateAndTransformBody,
  defineMiddlewares, 
} from "@medusajs/framework/http"
import { createDigitalProductsSchema, deleteMediasSchema } from "./validation-schemas"
import multer from "multer"

const upload = multer({ storage: multer.memoryStorage() })

export default defineMiddlewares({
  routes: [
    {
      matcher: "/admin/digital-products",
      method: "POST",
      middlewares: [
        validateAndTransformBody(createDigitalProductsSchema),
      ],
    },
    {
      matcher: "/admin/digital-products/:dpid/medias**",
      method: "POST",
      middlewares: [
         upload.array("files"),
       ]
    },
 
    {
      matcher: "/admin/digital-products/upload**",
      method: "POST",
      middlewares: [
        upload.array("files"),
      ]
    }
  ],
})