
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class ShipmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async getShipment(trackingNumber: string) {
    const shipment = await this.prisma.shipment.findUnique({
      where: {
        trackingNumber: trackingNumber,
      },
      include: {
        events: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 5,
        },
      },
    });

    if (!shipment) {
      throw new NotFoundException('Shipment not found');
    }

    return shipment;
  }
}
