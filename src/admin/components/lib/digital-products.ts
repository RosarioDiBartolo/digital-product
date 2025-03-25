 
export const ThreeDimMimeTypes = [
  "model/ply",
  "model/obj",
  "text/plain", // Some servers use this for OBJ files
  "model/gltf+json",
  "model/gltf-binary",
  "model/stl",
  "application/sla", // Another common STL type
  "application/octet-stream", // Common fallback for FBX
  "model/fbx", // Not standardized but used for FBX
];

// Mapping MIME types to likely file extensions
export const ThreeDimExtensions = [
  ".ply",
  ".obj",
  ".gltf",
  ".glb",
  ".stl",
  ".fbx",
];
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { DigitalProduct } from "../../types";
 

export const SupportedMedias = [
  "image/*",
  ...ThreeDimMimeTypes,
  ...ThreeDimExtensions,
].join(",");

export const useAddMedias = (dpid: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ Files, type }: { Files: File[]; type: string }) => {
      const res = await AddProductMedias(dpid, Files, type);

      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [dpid],
      });
    },
  });
};

export const useDeleteMedias = (dpid: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ mids }: { mids: string[] }) => {
      return await DeleteMedias(dpid, mids);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [dpid],
      });
    },
  });
};

export const useDigitalProducts = (query: URLSearchParams) =>
  useQuery({
    placeholderData: {
      count: 0,
      digital_products: [],
    },
    queryFn: async () => {
      const res = await fetch(`/admin/digital-products?${query.toString()}`, {
        credentials: "include",
      });

      const { digital_products, count } = await res.json();

      return {
        digital_products: digital_products as DigitalProduct[],
        count: count as number,
      };
    },
    queryKey: ["products", query.toString()],
  });

export const DeleteMedias = async (dpid: string, mids: string[]) => {
  try {
    await fetch(`/admin/digital-products/${dpid}/medias`, {
      method: "DELETE",
      credentials: "include",
      body: JSON.stringify(mids),
    });
  } catch (error) {
    console.error("Error deleting media:", error);
  }
};

export const AddProductMedias = async (
  dpid: string,
  Files: File[],
  type: string
) => {
  const formData = new FormData();

  Files.forEach((f) => formData.append("files", f));
  formData.append("type", type);

  const response = await fetch(`/admin/digital-products/${dpid}/medias/`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  const { files } = await response.json();

  return files as { url: string; id: string }[];
};

export const useVariantDigitalProduct = (variant_id: string ) =>
  useQuery({
    queryFn: async () => {
      const res = await fetch(
        `/admin/digital-products/variants/${variant_id}`,
        {
          method: "GET",
          credentials: "include",
          
        }
      );

      
        const digital_product: DigitalProduct =  res.ok? await res.json(): undefined

        return( {digital_product})
       
    },
    queryKey: ["variant_product", variant_id],
  });
export const useAddDigitalProduct = (variant_id: string ) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variant_name: string) => {

      console.log({variant_name})

      await fetch(`/admin/digital-products/variants/${variant_id}`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify( {
          name: variant_name,
         })
      });
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: ["variant_product", variant_id],
      });
    },
  });
};
