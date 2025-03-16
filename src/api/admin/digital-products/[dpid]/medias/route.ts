import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework"
import { uploadFilesWorkflow } from "@medusajs/medusa/core-flows"
import { MedusaError } from "@medusajs/framework/utils"
import { MediaType } from "src/admin/types"
import AddDigitalProductMediasWorkflow from "src/workflows/add-medias-to-digital-product"
import { CreateDigitalProductMediaInput } from "src/workflows/add-medias-to-digital-product/steps/create-digital-product-medias-step"
  
import DeleteDigitalProductMediasWorkflow from "src/workflows/delete-digital-product-media"

 
 
export const POST = async (
  req: AuthenticatedMedusaRequest<{type: MediaType}>,
  res: MedusaResponse
) => {

  const {type} = req.body
  const {dpid} = req.params
  const access = type === "main" ? "private" : "public"
  const files = req.files as Express.Multer.File[]

  if (!files?.length) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "No files were uploaded"
    )
  }

  const { result: uploadedFiles } = await uploadFilesWorkflow(req.scope).run({
    input: {
      files: files?.map((f) => ({
        filename: f.originalname,
        mimeType: f.mimetype,
        content: f.buffer.toString("binary"),
        access,
      })),
    },
  })

  const medias: CreateDigitalProductMediaInput[] = uploadedFiles.map(
    (file, i)=> ({ fileId: file.id, type, mimeType: files[i].mimetype})
  )

  const { result  } = await AddDigitalProductMediasWorkflow(req.scope).run({
    input: {
      medias, 
      dpid
    }
  })
  

  res.status(200).json({ files: medias })
}
 
export const DELETE = async (
    req: AuthenticatedMedusaRequest< string[] >,
    res: MedusaResponse
  ) => {
    const mids = req.body    
    const dpid = req.params.dpid   

     if (!mids) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "No mids were provided for deletion"
      )
    }
  
 
    const {result} = await DeleteDigitalProductMediasWorkflow(req.scope).run({
      input: {
        ids: mids, dpid
      }
    })

    res.status(200).json({ files: result })
  }
  