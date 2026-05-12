"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadProcessor = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const ali_oss_1 = __importDefault(require("ali-oss"));
const OSSClient = ali_oss_1.default;
let UploadProcessor = class UploadProcessor extends bullmq_1.WorkerHost {
    client;
    constructor() {
        super();
        this.client = new OSSClient({
            region: process.env.ALICLOUD_OSS_REGION,
            accessKeyId: process.env.ALICLOUD_OSS_ACCESS_KEY,
            accessKeySecret: process.env.ALICLOUD_OSS_SECRET_KEY,
            bucket: process.env.ALICLOUD_OSS_BUCKET,
        });
    }
    async process(job) {
        const { filename, buffer } = job.data;
        await new Promise((res) => setTimeout(res, 2000));
        try {
            const result = await this.client.put(`products/${Date.now()}-${filename}`, Buffer.from(buffer));
            console.log(`Job ${job.id} 完成: ${result.url}`);
            return result.url;
        }
        catch (err) {
            console.error('上传失败，自动触发重试');
            throw err;
        }
    }
};
exports.UploadProcessor = UploadProcessor;
exports.UploadProcessor = UploadProcessor = __decorate([
    (0, bullmq_1.Processor)('image-upload'),
    __metadata("design:paramtypes", [])
], UploadProcessor);
//# sourceMappingURL=upload.processor.js.map