import { generateComponents } from "@uploadthing/react";
 
import type { MyFileRouter } from "~/server/uploadthing";
 
export const { UploadButton, UploadDropzone, Uploader } =
  generateComponents<MyFileRouter>();