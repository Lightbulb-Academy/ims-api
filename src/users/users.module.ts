import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrganizationsService } from 'src/organizations/organizations.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, OrganizationsService],
})
export class UsersModule {}
