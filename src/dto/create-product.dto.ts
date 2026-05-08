import { IsString, IsNumber, Min, Length } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @Length(3, 50, { message: '商品名称长度需在 3-50 之间' })
  name!: string;

  @IsNumber()
  @Min(0, { message: '价格不能为负数' })
  price!: number;
}
