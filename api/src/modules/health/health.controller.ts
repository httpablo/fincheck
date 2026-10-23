import { Controller, Get } from '@nestjs/common';
import { IsPublic } from 'src/shared/decorators/IsPublic';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @IsPublic()
  @Get()
  check() {
    return this.healthService.check();
  }
}
