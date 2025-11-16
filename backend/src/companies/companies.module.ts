import { Module } from '@nestjs/common';
import { InvitesModule } from '../invites/invites.module';
import { UsersModule } from '../users/users.module';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';

@Module({
  imports: [InvitesModule, UsersModule],
  controllers: [CompaniesController],
  providers: [CompaniesService],
  exports: [CompaniesService],
})
export class CompaniesModule {}
