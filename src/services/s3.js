import {
    S3Client,
    PutObjectCommand,
    DeleteObjectCommand,
    paginateListObjectsV2,
    GetObjectCommand,

} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { s3_client } from '../../config.js';

class S3 {

    constructor() {
        this.bucket = process.env.AWS_BUCKET_NAME || "interskol"
        this.s3 = s3_client
    }
    async upload(file, name, folder = 'temp/') {
        try {
            const command = new PutObjectCommand({
                Bucket: this.bucket,
                Key: folder + name,
                Body: file.buffer,
                ContentType: file.mimetype,
            });
            await this.s3.send(command)

        } catch (e) {
            console.log(e);
        }

    }
    async getDownloadUrl(name, folder) {
        try {
            const command = new GetObjectCommand({
                Bucket: this.bucket,
                Key: folder + name,
            });

            return await getSignedUrl(this.s3, command, {
                expiresIn: 3600, // 1 час
            });
        } catch (err) {
            console.log(err)
        }

    }
    async delete(name, folder) {
        try {
            const command = new DeleteObjectCommand({
                Bucket: this.bucket,
                Key: folder + name,
            });
            const response = await s3.send(command);
            console.log("Объект удалён:", response);
        } catch (err) {
            console.error("Ошибка:", err);
        }

    }
}
const S3_service = new S3()
export { S3_service }