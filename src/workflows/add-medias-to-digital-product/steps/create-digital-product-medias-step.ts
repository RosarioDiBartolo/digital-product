import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import DigitalProductModuleService from "../../../modules/digital-product/service";
import { DIGITAL_PRODUCT_MODULE } from "../../../modules/digital-product";
import { MediaType } from "../../../modules/digital-product/types";

export type CreateDigitalProductMediaInput = {
  type: MediaType;
  fileId: string;
  mimeType: string;
};

type CreateDigitalProductMediasStepInput = {
  medias: CreateDigitalProductMediaInput[];
  dpid: string;
};

const createDigitalProductMediasStep = createStep(
  "create-digital-product-medias-step",
  async (
    { medias, dpid }: CreateDigitalProductMediasStepInput,
    { container }
  ) => {
    const digitalProductModuleService: DigitalProductModuleService =
      container.resolve(DIGITAL_PRODUCT_MODULE);

    const digitalProductMedias =
      await digitalProductModuleService.createDigitalProductMedias(
        medias.map((m) => ({ ...m, digital_product_id: dpid }))
      );

    return new StepResponse(
      {
        digitalProductMedias,
      },
      {
        digitalProductMedias,
      }
    );
  },
  async ({ digitalProductMedias }, { container }) => {
    const digitalProductModuleService: DigitalProductModuleService =
      container.resolve(DIGITAL_PRODUCT_MODULE);

    await digitalProductModuleService.deleteDigitalProductMedias(
      digitalProductMedias.map((media) => media.id)
    );
  }
);

export default createDigitalProductMediasStep;
