import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const { fields } = req.validatedQuery || {};
  const { dpid } = req.params;
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  const { data: digitalProducts } = await query.graph({
    entity: "digital_product",
    fields: ["*", "medias.*", "product_variant.*", ...(fields || [])],
    filters: {
      id: dpid,
    },
  });

 
  res.json(digitalProducts[0]);
};
 