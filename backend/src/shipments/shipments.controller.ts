
import { Controller, Get, Param } from '@nestjs/common';
import { ShipmentsService } from './shipments.service.js';

@Controller('shipments')
export class ShipmentsController {
  constructor(
    private readonly shipmentsService: ShipmentsService,
  ) {}

  @Get(':trackingNumber')
  getShipment(
    @Param('trackingNumber') trackingNumber: string,
  ) {
    return this.shipmentsService.getShipment(trackingNumber);
  }
}
