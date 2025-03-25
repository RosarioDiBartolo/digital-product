import { useRef, useState } from "react";
import {
  SupportedMedias,
  ThreeDimExtensions,
  ThreeDimMimeTypes,
  AddProductMedias,
  useAddMedias
 } from "./lib/digital-products";
import { MediaType } from "../types";
import { Button, Select } from "@medusajs/ui"; 

 
 

function AddMedia({ dpid }: { dpid: string }) {
  const [selectedType, setSelectedType] = useState<MediaType>(
    MediaType.PREVIEW
  );

  const [MediaFile, setMediaFile] = useState<File>();
  const inpRef = useRef<HTMLInputElement>(null);

    const {mutateAsync: AddMediasToProduct, isPending} = useAddMedias(
      dpid
    )
 
  // Helper function to check if file is a 3D model
  const isThreeDimFile = (file: File) => {
    return (
      ThreeDimMimeTypes.includes(file.type) || // Check MIME type
      ThreeDimExtensions.some((ext) => file.name.toLowerCase().endsWith(ext)) // Check file extension
    );
  };

  return (
    <form
      className="space-y-3 w-fit inline-block"
      onSubmit={(e) => {
        e.preventDefault();
        if (MediaFile && selectedType) {
           AddMediasToProduct({Files:[MediaFile], type:selectedType});
           setMediaFile( undefined )
        }
      }}
    >
      <input
        name="files"
        accept={SupportedMedias}
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
      <Button
        className="h-40 w-40 p-0 block"
        type="button"
        onClick={() => inpRef.current?.click()}
      >
        {MediaFile ? (
          isThreeDimFile(MediaFile) ? (
            <> 
          <p className=" p-2"> Preview disabled for 3D type of medias</p>  
          <span className=" bold">({MediaFile.name})</span>
          </>
           ) : (
            <img
              className="object-cover w-full"
              src={URL.createObjectURL(MediaFile)}
              alt="Selected media"
            />
          )
        ) : (
          "Select file"
        )}
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
      <Button disabled = {isPending} type="submit" className="w-full">
        Add media
      </Button>
    </form>
  );
}

export default AddMedia;
