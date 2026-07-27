import { IsArray, IsInt, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class PurchaseItemDto {
  @IsInt()
  productId!: number;

  @IsInt()
  quantity!: number;

  @IsNumber()
  price!: number;
}

export class CreatePurchaseDto {
  @IsInt()
  supplierId!: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PurchaseItemDto)
  items!: PurchaseItemDto[];
}
