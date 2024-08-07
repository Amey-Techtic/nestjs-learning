import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [
    // The forRoot() method accepts the same configuration object as mongoose.connect()
    MongooseModule.forRoot('mongodb://127.0.0.1/nestjs-example'),
    UsersModule,
    PostsModule,
  ],

})
export class AppModule {}
