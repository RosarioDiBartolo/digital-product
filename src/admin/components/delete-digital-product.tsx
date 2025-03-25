import { Prompt } from "@medusajs/ui";
import { Trash } from "@medusajs/icons";
import { sdk } from "../../lib/medusa";
import { DigitalProduct } from "../types";
import { useQueryClient, useMutation } from "@tanstack/react-query";

const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (product_id: string) => sdk.admin.product.delete(product_id),
    onSuccess:async () => {
      await queryClient.invalidateQueries({ queryKey: ["products"] }); // Ensure key matches the query
      await queryClient.refetchQueries({ queryKey: ["products"] }); // Force refresh immediately
    },
    onError: (error: any) => {
      console.error("Failed to delete product:", error);
    },
  });
};

function DeleteDigitalProduct({ digitalProduct }: { digitalProduct: DigitalProduct }) {
  const mutation = useDeleteProduct();
  
  const productId = digitalProduct.product_variant?.product_id;

  const onClick = async () => {
    if (!productId) {
      console.error("Unable to delete digital product. product_id is undefined");
      return;
    }

    try {
      await mutation.mutateAsync(productId);
    } catch (error) {
      console.error("Error deleting digital product:", error);
    }
  };

  return (
    <Prompt>
      <Prompt.Trigger>
        <Trash />
      </Prompt.Trigger>
      <Prompt.Content>
        <Prompt.Header>
          <Prompt.Title>
            Delete <span className="font-extrabold">{digitalProduct.name}</span>
          </Prompt.Title>
          <Prompt.Description>Are you sure? This cannot be undone.</Prompt.Description>
        </Prompt.Header>
        <Prompt.Footer>
          <Prompt.Cancel disabled={mutation.isPending}>Cancel</Prompt.Cancel>
          <Prompt.Action onClick={onClick} disabled={mutation.isPending}>
            {mutation.isPending ? "Deleting..." : "Delete"}
          </Prompt.Action>
        </Prompt.Footer>
      </Prompt.Content>
    </Prompt>
  );
}

export default DeleteDigitalProduct;
