import { ConflictException, Injectable } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ItemsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createItemDto: CreateItemDto) {
    let item = await this.prismaService.item.findFirst({
      where: { name: createItemDto.name },
    });

    return this.prismaService.$transaction(async (tx) => {
      if (!item) {
        item = await tx.item.create({ data: createItemDto });
      }

      const itemOrganization = await tx.itemOrganization.findFirst({
        where: {
          item_id: item.id,
          organization_id: createItemDto.organization_id,
        },
      });

      if (itemOrganization) {
        throw new ConflictException('This item has already been added!');
      }

      await tx.itemOrganization.create({
        data: {
          item_id: item.id,
          organization_id: createItemDto.organization_id,
          ...(createItemDto.quantity && {
            quanity: createItemDto.quantity,
          }),
        },
      });

      return item;
    });

    // return this.prismaService.item.upsert({
    //   where: {
    //     name: createItemDto.name,
    //   },
    //   update: {
    //     organizations: {
    //       upsert: {
    //         where: {
    //           item_id_organization_id: {
    //             item_id: item?.id,
    //             organization_id: createItemDto.organization_id,
    //           },
    //         },
    //         update: {},
    //         create: {
    //           organization_id: createItemDto.organization_id,
    //           ...(createItemDto.quantity && {
    //             quanity: createItemDto.quantity,
    //           }),
    //         },
    //       },
    //       create: {
    //         organization_id: createItemDto.organization_id,
    //         ...(createItemDto.quantity && {
    //           quanity: createItemDto.quantity,
    //         }),
    //       },
    //     },
    //   },
    //   create: {
    //     name: createItemDto.name,
    //     // description: createItemDto.description ?? null,
    //     ...(createItemDto.description && {
    //       description: createItemDto.description,
    //     }),
    //     organizations: {
    //       create: {
    //         organization_id: createItemDto.organization_id,
    //         ...(createItemDto.quantity && {
    //           quanity: createItemDto.quantity,
    //         }),
    //       },
    //     },
    //   },
    // });
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
