import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';

@Injectable()
export class StockService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateStockDto) {
    return this.prisma.stockMovement.create({
      data: {
        productId: dto.productId,
        quantity: dto.quantity,
        type: dto.type,
      },
    });
  }

  async findOne(id: number) {
    const movement = await this.prisma.stockMovement.findUnique({
      where: { id },
      include: {
        product: true,
      },
    });

    return movement;
  }
  findAll() {
    return this.prisma.stockMovement.findMany({
      include: {
        product: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
  async getInventory() {
    return this.prisma.product.findMany({
      where: {
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        quantity: true,
        category: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }
  async update(id: number, updateStockDto: UpdateStockDto) {
    const movement = await this.prisma.stockMovement.update({
      where: { id },
      data: updateStockDto,
    });

    return movement;
  }

  async remove(id: number) {
    const movement = await this.prisma.stockMovement.delete({
      where: { id },
    });

    return movement;
  }
}
