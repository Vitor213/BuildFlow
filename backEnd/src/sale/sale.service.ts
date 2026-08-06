import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, StockType } from '@prisma/client';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSaleDto } from './dto/create-sale.dto';

@Injectable()
export class SaleService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateSaleDto) {
    return this.prisma.$transaction(async (tx) => {
      let total = 0;

      for (const item of dto.items) {
        const product = await tx.product.findUnique({
          where: {
            id: item.productId,
          },
        });

        if (!product) {
          throw new BadRequestException('Produto não encontrado');
        }

        if (product.quantity < item.quantity) {
          throw new BadRequestException(
            `Estoque insuficiente para ${product.name}`,
          );
        }

        total += item.quantity * item.price;
      }

      const sale = await tx.sale.create({
        data: {
          customerId: dto.customerId,
          total: new Prisma.Decimal(total),
        },
      });

      for (const item of dto.items) {
        await tx.saleItem.create({
          data: {
            saleId: sale.id,
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
              decrement: item.quantity,
            },
          },
        });

        await tx.stockMovement.create({
          data: {
            productId: item.productId,
            quantity: item.quantity,
            type: StockType.EXIT,
            reason: 'Venda',
          },
        });
      }

      return sale;
    });
  }
  findAll() {
    return this.prisma.sale.findMany({
      include: {
        customer: true,
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
    return this.prisma.sale.findUnique({
      where: { id },
      include: {
        customer: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });
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
    console.debug(id);

    throw new BadRequestException(
      'Vendas não podem ser excluídas para preservar o histórico.',
    );
  }
}
