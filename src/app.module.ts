import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RolesModule } from './roles/roles.module';
import { PrismaModule } from './prisma/prisma.module';
import { OrganizationsModule } from './organizations/organizations.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [RolesModule, PrismaModule, OrganizationsModule],
})
export class AppModule {}
