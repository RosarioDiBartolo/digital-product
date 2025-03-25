import {
  DigitalProductMedia as DigitalProductMediaType,
  MediaType,
} from "../../types";
import { PropsWithChildren, useRef, useState } from "react";
import { Select } from "@medusajs/ui";
import {  ThreeDimMimeTypes, useAddMedias, useDeleteMedias  } from "../lib/digital-products";
import ThreeDimView from "./3d-product-media";
function DigitalProductMedia({
   fileId,
   type,
  children,
  dpid,
  id,
  mimeType
}: PropsWithChildren<DigitalProductMediaType>) {
  const inpRef = useRef<HTMLInputElement>(null);
  const [selectedType, setSelectedType] = useState(type);

  const {mutate: DeleteProductMedias} = useDeleteMedias(
    dpid
  )

  const { mutate: AddMediasToProduct} = useAddMedias(
    dpid
  )
  const Update = async () => {
    const files = inpRef.current?.files;

    const file = files?.item(0);

 if (file && selectedType) {
       await DeleteProductMedias({mids: [id]}  );

       await AddMediasToProduct(   { Files: [file], type: selectedType});
     }
  };

  return (
    <div className="space-y-3 inline-block" >
      <input
        ref={inpRef}
        onChange={() => {
          if (inpRef.current?.files) {
            Update();
          }
        }}
        type="file"
        className="hidden"
      />
      
        <div className="relative group">
          {children}

          

        { ThreeDimMimeTypes.includes(mimeType)?<ThreeDimView mediaSrc={`/static/${fileId}`} /> : <img
            onClick={() => {
              inpRef.current?.click();
            }}
            className="h-40  object-cover  cursor-pointer group-hover:brightness-50 rounded-md"
            key={fileId}
            height={200}
            src={`/static/${fileId}`}
          />}
        </div>
       <Select
        value={selectedType}
        onValueChange={(v) => {
          setSelectedType(v as MediaType);
          Update();
        }}
      >
        <Select.Trigger>
          <Select.Value placeholder="Type" />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="main">Main</Select.Item>
          <Select.Item value="preview">Preview</Select.Item>
        </Select.Content>
      </Select>
    </div>
  );
}

export default DigitalProductMedia;
