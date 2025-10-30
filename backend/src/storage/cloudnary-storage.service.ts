import { cloudinaryClient } from "./cloudinary-client";
import { MultipartFile } from "@fastify/multipart";

export async function uploadDataToCloudinary(
    bucket: string,
    fileId: string,
    file: MultipartFile
) {
    return new Promise(async (resolve, reject) => {
        try {
            // Converter o arquivo para buffer
            const buffer = await file.toBuffer();
            
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
                        console.error('Erro no Cloudinary:', error);
                        return reject(new Error('Erro ao fazer upload'));
                    }
                    resolve(result.secure_url);
                }
            ).end(buffer);
        } catch (error) {
            console.error('Erro ao processar arquivo:', error);
            reject(new Error('Erro ao processar arquivo para upload'));
        }
    });
}