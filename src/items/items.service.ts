import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  async findAll(organization_id: number) {
    return this.prismaService.itemOrganization.findMany({
      where: {
        organization_id,
      },
      include: {
        item: true,
      },
    });
  }

  async findOne(id: number) {
    return `This action returns a #${id} item`;
  }

  async update(id: number, updateItemDto: UpdateItemDto) {
    console.log(updateItemDto);
    return `This action updates a #${id} item`;
  }

  async remove(id: number) {
    return `This action removes a #${id} item`;
  }

  private async getItem(id: number) {
    const role = await this.prismaService.role.findFirst({ where: { id } });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    return role;
  }
}
