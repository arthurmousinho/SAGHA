import { cloudinaryClient } from "./cloudinary-client";
import { z } from "zod";

export async function uploadDataToCloudinary(
    bucket: string,
    fileId: string,
    file: z.core.File
) {
    return new Promise((resolve, reject) => {
        cloudinaryClient.uploader.upload_stream(
            {
                folder: bucket,
                filename_override: fileId,
                public_id: fileId,
                unique_filename: true,
                transformation: [
                    { quality: 'auto' },
                    { fetch_format: 'auto' },
                ],
            },
            (error, result) => {
                if (error || !result) {
                    console.log(error);
                    return reject(`Erro ao fazer upload`);
                }
                resolve(result.secure_url);
            },
        ).end(file.arrayBuffer());
    });
}