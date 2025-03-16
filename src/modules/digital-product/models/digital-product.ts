import { model } from "@medusajs/framework/utils"
import DigitalProductMedia from "./digital-product-media"
import DigitalProductOrder from "./digital-product-order"
import { InferTypeOf } from "@medusajs/framework/types"

const DigitalProduct = model.define("digital_product", {
  id: model.id().primaryKey(),
  name: model.text(),
  medias: model.hasMany(() => DigitalProductMedia, {
    mappedBy: "digitalProduct"
  }),
  orders: model.manyToMany(() => DigitalProductOrder, {
    mappedBy: "products"
  })
})
.cascades({
  delete: ["medias"]
})


export type DigitalProductType = InferTypeOf< typeof DigitalProduct >
export default DigitalProduct