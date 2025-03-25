import { 
  createWorkflow,
  transform,
  WorkflowResponse
} from "@medusajs/framework/workflows-sdk"
import {
  CreateProductWorkflowInputDTO
} from "@medusajs/framework/types"
import { 
  createProductsWorkflow,
  createRemoteLinkStep
} from "@medusajs/medusa/core-flows"
import { 
  Modules
} from "@medusajs/framework/utils"
import createDigitalProductStep, { 
  CreateDigitalProductStepInput
} from "./steps/create-digital-product"
import createDigitalProductMediasStep, { 
  CreateDigitalProductMediaInput
} from "./steps/create-digital-product-medias"
import { DIGITAL_PRODUCT_MODULE } from "../../modules/digital-product"

type CreateDigitalProductFromVariantWorkflowInput = {
  digital_product: CreateDigitalProductStepInput & {
    medias: Omit<CreateDigitalProductMediaInput, "digital_product_id">[]
  }
  variant_id: string
}

const createDigitalProductFromVariantWorkflow = createWorkflow(
  "create-digital-product-from-variant",
  (input: CreateDigitalProductFromVariantWorkflowInput) => {
    const { medias, ...digitalProductData } = input.digital_product
 
    const { digital_product } = createDigitalProductStep(
      digitalProductData
    )

    const { digital_product_medias } = createDigitalProductMediasStep(
      transform({
        digital_product,
        medias
      },
      (data) => ({
        medias: data.medias.map((media) => ({
          ...media,
          digital_product_id: data.digital_product.id
        }))
      })
      )
    )

    createRemoteLinkStep([{
      [DIGITAL_PRODUCT_MODULE]: {
        digital_product_id: digital_product.id
      },
      [Modules.PRODUCT]: {
        product_variant_id: input.variant_id
      }
    }])

    return new WorkflowResponse({
      digital_product: {
        ...digital_product,
        medias: digital_product_medias
      }
    })
  }
)

export default createDigitalProductFromVariantWorkflow