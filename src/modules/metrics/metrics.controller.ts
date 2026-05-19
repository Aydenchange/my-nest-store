import { Controller, Get, Res } from '@nestjs/common';
import type { Response } from 'express';
import * as client from 'prom-client';

@Controller('metrics')
export class MetricsController {
  constructor() {
    // 初始化默认的监控指标（CPU、内存等）
    client.collectDefaultMetrics();
  }

  @Get()
  async getMetrics(@Res() res: Response): Promise<void> {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
  }
}
