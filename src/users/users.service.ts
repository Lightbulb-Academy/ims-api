import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    await this.checkIfUserEmailExist(createUserDto.email);
    await this.checkIfUserMobileExist(createUserDto.mobile);

    // @Todo: We need to hash password
    return 'This action adds a new user';
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
