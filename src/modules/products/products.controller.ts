import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { ProductsService } from './products.service';
import { CreateProductDto } from '../../dto/create-product.dto';
import { Roles } from '../auth/roles.decorator';
import { GetProductsQueryDto } from '../../dto/get-products-query.dto';

@Controller('products') // 路由前缀是 /products
@UseGuards(AuthGuard) // 整个控制器的接口都需要登录
export class ProductsController {
  // 这里就是 DI：声明需要 ProductsService，Nest 会自动实例化它
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getAllProducts(@Query() query: GetProductsQueryDto) {
    return this.productsService.findAll(query);
  }

  @Post()
  @Roles('admin') // 只有 admin 角色可以创建商品
  // @Body() 装饰器会自动解析 Request Body 并映射到 DTO
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get(':id')
  getProductById(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @Roles('admin')
  updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateProductDto,
  ) {
    return this.productsService.update(id, dto);
  }
}
