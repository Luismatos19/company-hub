import { Controller, Get } from '@nestjs/common';

@Controller()
export class HealthController {
  @Get('healthy')
  getHealthy() {
    return { status: 'ok' };
  }
}
