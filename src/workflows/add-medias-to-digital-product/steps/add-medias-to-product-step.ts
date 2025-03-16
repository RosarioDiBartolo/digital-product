import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import DigitalProductModuleService from "../../../modules/digital-product/service";
import { DIGITAL_PRODUCT_MODULE } from "../../../modules/digital-product";

type AddMediasToDigitalProductStepInput = {
  medias: string[];
  dpid: string;
};

const addMediasToDigitalProductStep = createStep(
  "add-medias-to-digital-product-step",
  async (
    { medias, dpid }: AddMediasToDigitalProductStepInput,
    { container }
  ) => {
    const digitalProductModuleService: DigitalProductModuleService =
      container.resolve(DIGITAL_PRODUCT_MODULE);



      console.log(dpid)
    const digitalProduct =
      await digitalProductModuleService.retrieveDigitalProduct(dpid, {
        relations: ["medias"],
      });

    const oldMedias = digitalProduct.medias.map((m) => m.id);
    const updatedDigitalProducts =
      await digitalProductModuleService.updateDigitalProducts({
        id: dpid,
        medias: [...oldMedias, ...medias],
      });

    return new StepResponse(
      {
        updatedDigitalProducts,
      },
      { oldMedias, dpid }
    );
  },
  async ({ oldMedias, dpid }, { container }) => {
    const digitalProductModuleService: DigitalProductModuleService =
      container.resolve(DIGITAL_PRODUCT_MODULE);

    await digitalProductModuleService.updateDigitalProducts({
      id: dpid,
      medias: oldMedias,
    });
  }
);

export default addMediasToDigitalProductStep;
