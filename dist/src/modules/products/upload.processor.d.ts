import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
type UploadJobData = {
    filename: string;
    buffer: Buffer;
    mimetype: string;
};
export declare class UploadProcessor extends WorkerHost {
    private readonly client;
    constructor();
    process(job: Job<UploadJobData>): Promise<string>;
}
export {};
