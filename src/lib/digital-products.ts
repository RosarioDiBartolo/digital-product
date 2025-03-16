import { string } from "prop-types";
import { useEffect, useState } from "react";
import { DigitalProduct, MediaType } from "src/admin/types";
import { useNavigate } from "react-router";

export const useDigitalProducts = (dep: any[]) => {
  const [DigitalProducts, setDigitalProducts] = useState<
    DigitalProduct[] | undefined
  >();

  useEffect(() => {
    const fetchPreview = async () => {
      const res = await fetch(`/admin/digital-products/`);
      const products = (await res.json()).digital_products as DigitalProduct[];
      setDigitalProducts(products);
    };

    fetchPreview();
  }, dep);

  return DigitalProducts;
};

export const useMedias =   (dpid) => {
  const nav = useNavigate();
  const DeleteProductMedias = async (mids: string[], update: boolean = true) => {
    await DeleteMedias(dpid, mids);
    if (update){nav(0)}
  };

  const AddMediasToProduct = async (files: File[], type: MediaType,update: boolean = true) => {
    await AddProductMedias(dpid, files, type);
    if (update){nav(0)}
  };

  return( {AddMediasToProduct,  DeleteProductMedias})
};
export const DeleteMedias = async (dpid: string, mids: string[]) => {
  try {
    await fetch(`/admin/digital-products/${dpid}/medias`, {
      method: "DELETE",
      credentials: "include",
      body: JSON.stringify( mids   ),
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
