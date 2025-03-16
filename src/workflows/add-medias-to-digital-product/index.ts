import {
  createWorkflow,
  transform,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";


import { CreateDigitalProductMediaInput } from "./steps/create-digital-product-medias-step";
import createDigitalProductMediasStep from "./steps/create-digital-product-medias-step";
import addMediasToDigitalProductStep from "./steps/add-medias-to-product-step";
 
type AddMediasToDigitalProductWorkflowInput = {
  medias: CreateDigitalProductMediaInput[] ;
   dpid: string;
};

const AddDigitalProductMediasWorkflow = createWorkflow(
  "add-medias-to-digital-product",
  (input: AddMediasToDigitalProductWorkflowInput) => {
    const { medias,  dpid } = input;
   
    const {digitalProductMedias} = createDigitalProductMediasStep({
      medias,  dpid
    })
  
    const {updatedDigitalProducts} = addMediasToDigitalProductStep({
      medias: transform(digitalProductMedias, data =>  data.map(d=>d.id) ),
      dpid
      }
    )

    
    return new WorkflowResponse({
      updatedDigitalProducts,
    });
  }
);

export default AddDigitalProductMediasWorkflow;
