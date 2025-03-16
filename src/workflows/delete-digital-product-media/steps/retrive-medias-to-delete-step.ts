import {
  createStep,
  StepResponse
} from "@medusajs/framework/workflows-sdk"
import DigitalProductModuleService from "../../../modules/digital-product/service"
import { DIGITAL_PRODUCT_MODULE } from "../../../modules/digital-product" 

export type RetriveMediasToDeleteStepInput = {
    ids: string[];
  }

 

const retriveMediasToDeleteStep = createStep(
  "retrive-medias-to-delete-step",
   async ({ 
    ids 
  }: RetriveMediasToDeleteStepInput, { container }) => {
    console.log(ids)
     const digitalProductModuleService: DigitalProductModuleService = 
      container.resolve(DIGITAL_PRODUCT_MODULE)

     await digitalProductModuleService
      .softDeleteDigitalProductMedias(ids )
 
      
    const medias= await digitalProductModuleService
    .listDigitalProductMedias({
        id: ids
    } )

     

    return new StepResponse({
        medias
    }    )
  } 
)

export default retriveMediasToDeleteStep