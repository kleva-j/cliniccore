import { protectedProcedure, router } from "./trpc";
import { z } from "zod";
import {
  storageGetDownloadUrl,
  storageUpload,
  storageDelete,
} from "./supabaseStorage";

export const storageRouter = router({
  upload: protectedProcedure
    .input(
      z.object({
        file: z.string(),
        fileName: z.string(),
        contentType: z.string(),
        folder: z.string().default("uploads"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const buffer = Buffer.from(input.file, "base64");
      const result = await storageUpload(
        "clinic-documents",
        `${input.folder}/${Date.now()}-${input.fileName}`,
        buffer,
        input.contentType
      );
      return result;
    }),

  getDownloadUrl: protectedProcedure
    .input(
      z.object({ fileKey: z.string(), expiresIn: z.number().default(3600) })
    )
    .query(async ({ input }) => {
      const url = await storageGetDownloadUrl(
        "clinic-documents",
        input.fileKey,
        input.expiresIn
      );
      return { url };
    }),

  delete: protectedProcedure
    .input(z.object({ fileKeys: z.array(z.string()) }))
    .mutation(async ({ input, ctx }) => {
      await storageDelete("clinic-documents", input.fileKeys);
      return { success: true };
    }),
});
