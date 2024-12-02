import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { hash } from 'bcrypt';
import { OrganizationsService } from 'src/organizations/organizations.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly organizationsService: OrganizationsService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const roleObj = await this.prismaService.role.findFirst({
      where: { name: createUserDto.role },
    });

    if (!roleObj) {
      throw new BadRequestException(`Role ${createUserDto.role} not found`);
    }

    createUserDto.role_id = roleObj.id;

    await this.organizationsService.findOne(createUserDto.organization_id);
    await this.checkIfUserEmailExist(createUserDto.email);
    await this.checkIfUserMobileExist(createUserDto.mobile);

    createUserDto.password = await hash(createUserDto.password, 10);

    const { role, ...rest } = createUserDto;
    return this.prismaService.user.create({ data: rest });
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  private async checkIfUserEmailExist(email: string, id?: number) {
    const doesUserEmailExist = await this.prismaService.user.findFirst({
      where: { email },
    });

    if (doesUserEmailExist) {
      if (id && doesUserEmailExist.id !== id) {
        // this is update case
        throw new BadRequestException(
          `User with email ${email} already exists`,
        );
      } else if (!id) {
        // this is create case
        throw new BadRequestException(
          `User with email ${email} already exists`,
        );
      }
    }
  }

  private async checkIfUserMobileExist(mobile: string, id?: number) {
    const doesUserMobileExist = await this.prismaService.user.findFirst({
      where: { mobile },
    });

    if (doesUserMobileExist) {
      if (id && doesUserMobileExist.id !== id) {
        // this is update case
        throw new BadRequestException(
          `User with mobile ${mobile} already exists`,
        );
      } else if (!id) {
        // this is create case
        throw new BadRequestException(
          `User with mobile ${mobile} already exists`,
        );
      }
    }
  }
}
