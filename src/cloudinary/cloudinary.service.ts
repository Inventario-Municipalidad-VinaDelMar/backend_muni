import { Injectable, Inject } from '@nestjs/common';
import { v2 as cloudinary, DeleteApiResponse } from 'cloudinary';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {

    async uploadFile(
        file: Express.Multer.File,
        folderName: string,
    ): Promise<UploadApiResponse | UploadApiErrorResponse> {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    resource_type: 'auto',
                    folder: folderName,
                    // folder: 'actas_legales',
                },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                },
            ).end(file.buffer);
        });
    }


    async deleteFile(fileId: string, folderName: string): Promise<DeleteApiResponse> {
        return new Promise((resolve, reject) => {

            cloudinary.uploader.destroy(
                `${folderName}/${fileId}`,
                // `actas_legales/${fileId}`,
                { resource_type: 'image', },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                },
            );
        });
    }

}
