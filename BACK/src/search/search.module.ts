import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { UserModule } from '../user/user.module';
import { ProjectModule } from '../project/project.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [UserModule, ProjectModule, AuthModule],
  controllers: [SearchController],
})
export class SearchModule {}
