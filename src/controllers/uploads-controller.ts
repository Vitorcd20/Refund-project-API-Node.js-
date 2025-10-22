import { Request, Response } from "express";
import z from "zod";
import uploadConfig from "@/configs/upload";

class UploadsController {
  async create(request: Request, response: Response) {
    try {
      const fileSchema = z
        .object({
          filename: z.string().min(1, { message: "File is required" }),
          mimeType: z
            .string()
            .refine(
              (type) => uploadConfig.ACCEPTED_IMAGE_TYPES.includes(type),
              `Format is not valid. Allowed formats: ${uploadConfig.ACCEPTED_IMAGE_TYPES}`
            ),
          size: z
            .number()
            .positive()
            .refine(
              (size) => size <= uploadConfig.MAX_FILE_SIZE,
              `File exceeds the size limit`
            ),
        })
        .passthrough();

      const { file } = fileSchema.parse(request.file);

      response.json({ message: "ok" });

    } catch (error) {}
  }
}

export { UploadsController };
