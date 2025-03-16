 
 
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import DigitalProductModuleService from "../../../modules/digital-product/service";
import { DIGITAL_PRODUCT_MODULE } from "../../../modules/digital-product";

type RetrieveDigitalProductMediaStepInput = {
    ids: string[];
};

const RetrieveDigitalProductMediaStep = createStep(
  "retrive-digital-product-media-step",
  async ({ ids }: RetrieveDigitalProductMediaStepInput, { container }) => {
    const digitalProductModuleService: DigitalProductModuleService =
      container.resolve(DIGITAL_PRODUCT_MODULE);

    const digitalProductMedias =
      await digitalProductModuleService.listDigitalProductMedias({
        id: ids
      });

    return new StepResponse(
      {
        digitalProductMedias,
      } 
    );
  }
);

export default RetrieveDigitalProductMediaStep;
