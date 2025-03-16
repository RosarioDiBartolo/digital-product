import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework"
import { MedusaError } from "@medusajs/framework/utils"
import { MediaType } from "src/admin/types"
import createDigitalProductMediasWorkflow from "src/workflows/create-digital-product-medias"

 
 
export const POST = async (
    req: AuthenticatedMedusaRequest<{fileId: string, mimeType: string, type: MediaType}[]>,
    res: MedusaResponse 
  ) => {

    const dpid = req.params.dpid
    const filesData =  req.body 
 
    if (!dpid) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "No dpid was provided"
      )
    }
    
  
    const {result} = await createDigitalProductMediasWorkflow(req.scope).run({
      input: {
          dpid,
          medias: filesData
       }
    })

    res.status(200).json({ files: result })
  }
  