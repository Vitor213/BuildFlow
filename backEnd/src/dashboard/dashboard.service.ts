import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboard() {
    const [
      products,
      categories,
      customers,
      suppliers,
      sales,
      purchases,
      lowStock,
      outOfStock,
    ] = await Promise.all([
      this.prisma.product.count(),

      this.prisma.category.count(),

      this.prisma.customer.count(),

      this.prisma.supplier.count(),

      this.prisma.sale.aggregate({
        _sum: {
          total: true,
        },
      }),

      this.prisma.purchase.aggregate({
        _sum: {
          total: true,
        },
      }),

      this.prisma.product.count({
        where: {
          quantity: {
            lte: 5,
          },
        },
      }),

      this.prisma.product.count({
        where: {
          quantity: 0,
        },
      }),
    ]);

    return {
      products,
      categories,
      customers,
      suppliers,
      totalSales: sales._sum.total ?? 0,
      totalPurchases: purchases._sum.total ?? 0,
      lowStock,
      outOfStock,
    };
  }
}
