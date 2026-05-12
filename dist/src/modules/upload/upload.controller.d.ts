import { Queue } from 'bullmq';
type UploadInputFile = {
    originalname: string;
    buffer: Buffer;
    mimetype: string;
};
export declare class UploadController {
    private readonly imageQueue;
    constructor(imageQueue: Queue);
    uploadAsync(file: UploadInputFile): Promise<{
        jobId: string | undefined;
        message: string;
    }>;
}
export {};
