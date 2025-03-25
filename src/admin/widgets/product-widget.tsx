import { defineWidgetConfig } from "@medusajs/admin-sdk";
import {
  DetailWidgetProps,
  AdminProductVariant,
} from "@medusajs/framework/types";
import { Button, Container, Heading } from "@medusajs/ui";
import {
  useAddDigitalProduct,
  useVariantDigitalProduct,
} from "../components/lib/digital-products";
  import { Link } from "react-router-dom"
import { DigitalProduct } from "../types";
 
// The widget
const DigitalProductWidget = ({
  data: { id, title},
}: DetailWidgetProps<AdminProductVariant>) => {
  const { data ,isLoading } = useVariantDigitalProduct(id );
     
   
  const { mutateAsync: AddDigitalProduct } = useAddDigitalProduct(id );

  
  if (isLoading){
    return "..."
  }

  const digital_product: DigitalProduct = data?.digital_product
  
  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Related Digital Product </Heading>

        {digital_product ? (
         <Link to={`/digital-products/${digital_product.id}`}>  {digital_product.name }</Link> 
        ) : (
          <Button onClick={() => AddDigitalProduct(title || `${id}_digital_product` )}>
            Add digital product
          </Button>
        )}
      </div>
    </Container>
  );
};

// The widget's configurations
export const config = defineWidgetConfig({
  zone: "product_variant.details.after",
});

export default DigitalProductWidget;
