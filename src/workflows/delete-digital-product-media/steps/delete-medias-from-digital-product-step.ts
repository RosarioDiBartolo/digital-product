import {
  createStep,
  StepResponse
} from "@medusajs/framework/workflows-sdk"
import DigitalProductModuleService from "../../../modules/digital-product/service"
import { DIGITAL_PRODUCT_MODULE } from "../../../modules/digital-product" 

export type DeleteDigitalProductMediasStepInput = {
    ids: string[];
    dpid: string;
 }

 

const DeleteDigitalProductMediasStep = createStep(
  "delete-digital-product-medias-step",
  async ({ 
    ids, dpid
  }: DeleteDigitalProductMediasStepInput, { container }) => {
    console.log(ids)

     const digitalProductModuleService: DigitalProductModuleService = 
      container.resolve(DIGITAL_PRODUCT_MODULE)

     await digitalProductModuleService
      .softDeleteDigitalProductMedias(ids )
 
      
    const digital_product = await digitalProductModuleService
    .retrieveDigitalProduct(dpid, {
      relations: ["medias"]
    })

    const updated_digital_product = await digitalProductModuleService
    .updateDigitalProducts({
        id: dpid,
        medias: digital_product.medias.map(m=> m.id).filter(id=> !ids.includes(id)  ) 
    } )
 

    return new StepResponse({
       updated_digital_product
    },
       {digital_product, ids}
    )
  },
  async ({ digital_product,ids }, { container }) => {
    const digitalProductModuleService: DigitalProductModuleService = 
      container.resolve(DIGITAL_PRODUCT_MODULE)
    
    await digitalProductModuleService.restoreDigitalProductMedias(
         ids
    )
     await digitalProductModuleService
    .updateDigitalProducts({
        id: digital_product.id,
        medias: digital_product.medias.map(m=> m.id) 
    } )

  }
)

export default DeleteDigitalProductMediasStep