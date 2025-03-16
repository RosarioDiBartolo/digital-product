import {
  createWorkflow,
  transform,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";

import DeleteDigitalProductMediasStep from "./steps/delete-medias-from-digital-product-step";
import { deleteFilesWorkflow } from "@medusajs/medusa/core-flows";
import retriveMediasToDeleteStep from "./steps/retrive-medias-to-delete-step"

type DeleteDigitalProductMediaWorkflowInput = {
  dpid: string;
  ids: string[];
};

const DeleteDigitalProductMediasWorkflow = createWorkflow(
  "delete-digital-product-medias",
  (input: DeleteDigitalProductMediaWorkflowInput) => {
    const { ids, dpid } = input;
     const {medias} = retriveMediasToDeleteStep({ids})

    deleteFilesWorkflow.runAsStep({
      input: {
        ids:  transform(medias, data=> data.map(m=>m.fileId))
      },
    });

    const { updated_digital_product } = DeleteDigitalProductMediasStep({
      ids ,
      dpid,
    });
    return new WorkflowResponse({
      updated_digital_product,
    });
  }
);

export default DeleteDigitalProductMediasWorkflow;
