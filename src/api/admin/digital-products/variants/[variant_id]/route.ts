import { ContainerRegistrationKeys } from "@medusajs/utils"
import { AuthenticatedMedusaRequest, MedusaResponse } from "node_modules/@medusajs/framework/dist/http/types"
import { createDigitalProductsFromVariantSchema } from "src/api/validation-schemas"
import createDigitalProductFromVariantWorkflow from "src/workflows/create-digital-product/create-digital-product-from-variant"
import { CreateDigitalProductMediaInput } from "src/workflows/create-digital-product/steps/create-digital-product-medias"
import DigitalProductVariantLink from "../../../../../links/digital-product-variant"
import {z} from "zod"
 
export const GET = async (
  req: AuthenticatedMedusaRequest ,
  res: MedusaResponse
)=>{
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const {variant_id} = req.params

   const { data } = await query.graph({
        entity: DigitalProductVariantLink.entryPoint,
        fields: ["digital_product.*"],
        filters: {
          product_variant_id: variant_id
        }
      })

    res.json(
      data[0]?.digital_product
    )
}

type CreateRequestBody = z.infer<
  typeof createDigitalProductsFromVariantSchema
>
export const POST = async (
  req: AuthenticatedMedusaRequest<CreateRequestBody>,
  res: MedusaResponse
) => {

    const {variant_id} = req.params
 
  const {name} = req.body 

  console.log(name)
   const { result: {digital_product} } = await createDigitalProductFromVariantWorkflow(
    req.scope
  ).run({
    input: {
      digital_product: {
        name: name || variant_id + "_digital_product",
        medias:  [] 
      },
      variant_id  
       
    }
  })

  
  res.json({
    digital_product 
  })
}