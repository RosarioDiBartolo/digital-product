 
import { SubscriberArgs, SubscriberConfig } from "@medusajs/framework";
import { 
  deleteProductDigitalProductsWorkflow
} from "../workflows/delete-product-digital-products";

export default async function handleVariantDeleted({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  await deleteProductDigitalProductsWorkflow(container)
    .run({
      input: data,
    })
}

export const config: SubscriberConfig = {
  event: "product-variant.deleted",
}