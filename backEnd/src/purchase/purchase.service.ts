import { Injectable } from '@nestjs/common';
import { Prisma, StockType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';

@Injectable()
export class PurchaseService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePurchaseDto) {
    return this.prisma.$transaction(async (tx) => {
      const total = dto.items.reduce(
        (sum, item) => sum + item.quantity * item.price,
        0,
      );

      const purchase = await tx.purchase.create({
        data: {
          supplierId: dto.supplierId,
          total: new Prisma.Decimal(total),
        },
      });

      for (const item of dto.items) {
        await tx.purchaseItem.create({
          data: {
            purchaseId: purchase.id,
            productId: item.productId,
            quantity: item.quantity,
            price: new Prisma.Decimal(item.price),
          },
        });

        await tx.product.update({
          where: { id: item.productId },
          data: {
            quantity: {
              increment: item.quantity,
            },
          },
        });

        await tx.stockMovement.create({
          data: {
            productId: item.productId,
            quantity: item.quantity,
            type: StockType.ENTRY,
            reason: 'Compra de fornecedor',
          },
        });
      }

      return purchase;
    });
  }

  findAll() {
    return this.prisma.purchase.findMany({
      include: {
        supplier: true,
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  findOne(id: number) {
    return this.prisma.purchase.findUnique({
      where: { id },
      include: {
        supplier: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  update(id: number, dto: UpdatePurchaseDto) {
    return this.prisma.purchase.update({
      where: { id },
      data: {
        supplierId: dto.supplierId,
      },
    });
  }

  remove(id: number) {
    return this.prisma.purchase.delete({
      where: { id },
    });
  }
}
