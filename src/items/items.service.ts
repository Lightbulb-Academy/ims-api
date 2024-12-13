import { Injectable } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ItemsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createItemDto: CreateItemDto) {
    return this.prismaService.item.upsert({
      where: {
        name: createItemDto.name,
      },
      update: {},
      create: {
        name: createItemDto.name,
        // description: createItemDto.description ?? null,
        ...(createItemDto.description && {
          description: createItemDto.description,
        }),
        organizations: {
          create: {
            organization_id: createItemDto.organization_id,
            ...(createItemDto.quantity && {
              quanity: createItemDto.quantity,
            }),
          },
        },
      },
    });
  }

  findAll() {
    return `This action returns all items`;
  }

  findOne(id: number) {
    return `This action returns a #${id} item`;
  }

  update(id: number, updateItemDto: UpdateItemDto) {
    console.log(updateItemDto);
    return `This action updates a #${id} item`;
  }

  remove(id: number) {
    return `This action removes a #${id} item`;
  }
}
