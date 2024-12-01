import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrganizationsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createOrganizationDto: CreateOrganizationDto) {
    await this.checkIfOrganizationExists(createOrganizationDto.name);
    return this.prismaService.organization.create({
      data: createOrganizationDto,
    });
  }

  async findAll() {
    return this.prismaService.organization.findMany();
  }

  async findOne(id: number) {
    return this.getOrganization(id);
  }

  async update(id: number, updateOrganizationDto: UpdateOrganizationDto) {
    await this.getOrganization(id);
    await this.checkIfOrganizationExists(updateOrganizationDto.name, id);
    return this.prismaService.organization.update({
      where: { id },
      data: updateOrganizationDto,
    });
  }

  async remove(id: number) {
    await this.getOrganization(id);
    return this.prismaService.organization.delete({ where: { id } });
  }

  private async checkIfOrganizationExists(name: string, id?: number) {
    const doesOrganizationExists =
      await this.prismaService.organization.findFirst({
        where: { name },
      });

    if (doesOrganizationExists) {
      if (id && doesOrganizationExists.id !== id) {
        // this is update case
        throw new BadRequestException(`Organization ${name} already exists`);
      } else if (!id) {
        // this is create case
        throw new BadRequestException(`Organization ${name} already exists`);
      }
    }
  }

  private async getOrganization(id: number) {
    const organization = await this.prismaService.organization.findFirst({
      where: { id },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    return organization;
  }
}
