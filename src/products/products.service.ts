import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('ProductsService');

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Connected to the database');
  }

  create(createProductDto: CreateProductDto) {
    return this.product.create({
      data: createProductDto,
    });
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    const totalPages = await this.product.count({ where: { available: true } });
    return {
      data: await this.product.findMany({
        take: limit,
        skip: (page - 1) * limit,
        where: { available: true },
      }),
      meta: {
        page: page,
        'Total Pages': Math.ceil(totalPages / limit),
        'Total Products': totalPages,
      },
    };
  }

  async findOne(id: number) {
    const product = await this.product.findUnique({
      where: { id, available: true },
    });
    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    } else {
      return product;
    }
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    // si updateProductDto es igual a {} entonces arroja un error
    const { id: __, ...data } = updateProductDto;
    if (Object.keys(updateProductDto).length === 0) {
      throw new NotFoundException(`There is no data to update`);
    }
    await this.findOne(__);
    //se hace doble lectura a la base de datos para verificar si el producto existe y para actualizarlo
    return this.product.update({
      where: { id },
      data: data,
    });
    //return updateProductDto;
  }

  async remove(id: number) {
    // return `This action removes a #${id} product`;
    await this.findOne(id);
    if (!id) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    // return this.product.delete({
    //   where: { id },
    // });
    const product = await this.product.update({
      where: { id },
      data: {
        available: false,
      },
    });
    return product;
  }
}
