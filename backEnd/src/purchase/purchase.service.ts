import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, StockType } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdateSaleDto } from '../sale/dto/update-sale.dto';
@Injectable()
export class PurchaseService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePurchaseDto) {
    const supplier = await this.prisma.supplier.findUnique({
      where: {
        id: dto.supplierId,
      },
    });

    if (!supplier) {
      throw new NotFoundException('Fornecedor não encontrado.');
    }

    return this.prisma.$transaction(async (tx) => {
      let total = 0;

      for (const item of dto.items) {
        const product = await tx.product.findUnique({
          where: {
            id: item.productId,
          },
        });

        if (!product) {
          throw new NotFoundException(
            `Produto ${item.productId} não encontrado.`,
          );
        }

        if (item.quantity <= 0) {
          throw new BadRequestException(
            'A quantidade deve ser maior que zero.',
          );
        }

        if (item.price <= 0) {
          throw new BadRequestException('O preço deve ser maior que zero.');
        }

        total += item.quantity * item.price;
      }

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
          where: {
            id: item.productId,
          },
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
            reason: `Compra #${purchase.id}`,
          },
        });
      }

      return this.findOne(purchase.id);
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

  async findOne(id: number) {
    const purchase = await this.prisma.purchase.findUnique({
      where: {
        id,
      },
      include: {
        supplier: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!purchase) {
      throw new NotFoundException('Compra não encontrada.');
    }

    return purchase;
  }

  update(id: number, dto: UpdateSaleDto) {
    return this.prisma.sale.update({
      where: { id },
      data: {
        customerId: dto.customerId,
      },
    });
  }

  remove(id: number) {
    return this.prisma.sale.delete({
      where: { id },
    });
  }
}
