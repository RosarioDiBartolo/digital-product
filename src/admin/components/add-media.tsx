import { useRef, useState } from "react";
import { useMedias } from "../../lib/digital-products";
import { MediaType } from "../types";
import { Button, Select } from "@medusajs/ui";
import { useNavigate } from "react-router";

function AddMedia({ dpid }: { dpid: string }) {
  const [selectedType, setSelectedType] = useState<MediaType>(
    MediaType.PREVIEW
  );

  const [MediaFile, setMediaFile] = useState<File>();
  const inpRef = useRef<HTMLInputElement>(null);

  
  const {AddMediasToProduct} = useMedias(dpid)
  return (
    <form  
    className="  space-y-3"
    onSubmit={e=>{
        e.preventDefault()
        if (MediaFile && selectedType){
          AddMediasToProduct(
             [MediaFile], selectedType
        )}
 

    }}
    >
       <input
        name="files"
        ref={inpRef}
        onChange={async (e) => {
          const file = e.target?.files?.item(0);
          if (file && selectedType) {
            setMediaFile(file);
          }
        }}
        type="file"
        className="hidden"
      />
      <Button className="h-40 p-0 w-full" type="button" onClick={() => inpRef.current?.click()}>
        {MediaFile ? <img      
        
        className=" object-cover w-full"
 src={URL.createObjectURL(MediaFile)} /> : "Select file"}
      </Button>

      <Select
        name="type"
        value={selectedType}
        onValueChange={(v) => {
          setSelectedType(v as MediaType);
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
      <Button type="submit" className="  w-full">Add media</Button>
    </form>
   );
}

export default AddMedia;
