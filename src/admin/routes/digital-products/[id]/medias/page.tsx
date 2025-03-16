import { useParams } from "react-router";
import {
  useMedias,
  useDigitalProducts,
} from "../../../../../lib/digital-products";
import { DigitalProduct } from "../../../../types";
import DigitalProductMedia from "../../../../components/digital-product-media";
import {
  Container,
  Heading,
  Table,
  Button,
  Drawer,
  Checkbox,
  CommandBar,
} from "@medusajs/ui";
import AddMedia from "../../../../components/add-media";
import { useState } from "react";

function DigitalProductPage() {
  const { id } = useParams<{ id: string }>();

  const DigitalProducts = useDigitalProducts([id]);

  const [Checked, setChecked] = useState<string[]>([]);

  const {DeleteProductMedias} = useMedias(id)
  if (!DigitalProducts) {
    return;
  }
  const DigitalProduct: DigitalProduct = DigitalProducts.find(
    (dp) => dp.id === id
  );
  console.log(Checked)

  return (
    id && (
      <Container>
        Product: <Heading className=" inline" level="h1">   {DigitalProduct.name} </Heading>
        <Heading level="h2"> Medias</Heading>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ">
          {DigitalProduct.medias?.map((m) => (
            <DigitalProductMedia {...m} key={m.fileId} dpid={id}>
              <Checkbox
                 onCheckedChange={(checked) =>
                  setChecked((old) =>
                    checked? [...old, m.id] :  old.filter((c) => c !== m.id) 
                  )
                }
                className=" hidden  group-hover:block absolute left-4 top-3 z-30"
              />
        
            </DigitalProductMedia>
          ))}
          <AddMedia dpid={id} />
        </div>

        <CommandBar open={Checked.length > 0}>
          <CommandBar.Bar>
            <CommandBar.Value>{Checked.length} selected</CommandBar.Value>
            <CommandBar.Seperator />
            <CommandBar.Command
              action={async () => {
                alert("Delete");
                 await DeleteProductMedias( Checked);
              }}
              label="Delete"
              shortcut="d"
            />
          </CommandBar.Bar>
        </CommandBar>
      </Container>
    )
  );
}

export default DigitalProductPage;
