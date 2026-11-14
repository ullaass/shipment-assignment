
import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ShipmentsModule } from './shipments/shipments.module.js';

@Module({
  imports: [ShipmentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
