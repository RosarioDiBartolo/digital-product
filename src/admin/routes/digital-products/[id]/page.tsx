import { useParams } from "react-router";
import { DeleteMedias   } from "../../../components/lib/digital-products";
import DigitalProductMedia from "../../../components/digital-product-media";
import { Container, Heading, Checkbox, CommandBar, clx } from "@medusajs/ui";
import AddMedia from "../../../components/add-media";
import { useState } from "react";
import { DigitalProduct } from "../../../types";
import { useMutation, useQuery, useQueryClient  } from "@tanstack/react-query";

function DigitalProductPage() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const {data: digitalProduct} =  useQuery({
   
    queryFn: async ( ) => {
      const res = await fetch(`/admin/digital-products/${id}`);
   
      const product: DigitalProduct = await res.json();
  
      return product
    }, 
    queryKey: [ id],
  })



  const {mutateAsync: DeleteProductMedias} = useMutation({
    mutationFn:async (mediasIds: string[])=>{
      if ( id) await DeleteMedias(id, mediasIds)

     },
     onSuccess: ()=>{
      queryClient.invalidateQueries({
        queryKey: [id]
      })
     }
  })



  const [Checked, setChecked] = useState<string[]>([]);
 
  if (!digitalProduct) {
    return;
  }

  console.log(digitalProduct);

  return (
    id && (
      <Container>
        Product:{" "}
        <Heading className=" inline" level="h1">
          {" "}
          {digitalProduct.name}{" "}
        </Heading>
        <Heading level="h2"> Medias</Heading>
        <div className=" space-x-5 ">
          {digitalProduct.medias?.map((m) => (
            <DigitalProductMedia {...m} key={m.fileId} dpid={id}>
              <Checkbox
                onCheckedChange={(checked) =>
                  setChecked((old) =>
                    checked ? [...old, m.id] : old.filter((c) => c !== m.id)
                  )
                }
                className={clx(
                  " absolute left-4 top-3 z-30 hidden group-hover:block",
                  Checked.includes(m.id) && "!block"
                )}
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
                await DeleteProductMedias(Checked);
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
