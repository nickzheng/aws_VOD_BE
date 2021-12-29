import { Controller, Get } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';

@ApiUseTags('health check')
@Controller()
export class AppController {
  @Get()
  // cache http result
  healthCheck(): string {
    return 'OK';
  }
}
