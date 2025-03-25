import { 
  validateAndTransformBody,
  defineMiddlewares,
  MedusaNextFunction,
  MedusaRequest,
  MedusaResponse, 
} from "@medusajs/framework/http"
import { createDigitalProductsFromVariantSchema, createDigitalProductsSchema  } from "./validation-schemas"
import multer from "multer"
import { ConfigModule } from "@medusajs/framework"
import { parseCorsOrigins } from "@medusajs/framework/utils"
import cors from "cors"

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
      matcher: "/static*",
      method: "GET",
         middlewares: [
          (
            req: MedusaRequest, 
            res: MedusaResponse, 
            next: MedusaNextFunction
          ) => {
            const configModule: ConfigModule =
              req.scope.resolve("configModule")
  
            return cors({
              
              origin: parseCorsOrigins(
                configModule.projectConfig.http.storeCors
              ),
              credentials: true,
            })(req, res, next)
          },
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