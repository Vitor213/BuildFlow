import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { StockModule } from './stock/stock.module';
import { SupplierModule } from './supplier/supplier.module';
import { PurchaseModule } from './purchase/purchase.module';

@Module({
  imports: [PrismaModule, AuthModule, CategoryModule, ProductModule, StockModule, SupplierModule, PurchaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
