import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    // The forRoot() method accepts the same configuration object as mongoose.connect()
    MongooseModule.forRoot('mongodb://127.0.0.1/nestjs-example'),
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
