import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQLDB_HOST,
      port: parseInt(process.env.MYSQLDB_DOCKER_PORT, 10),
      username: process.env.MYSQLDB_USER,
      password: process.env.MYSQLDB_PASSWORD,
      database: process.env.MYSQLDB_DATABASE,
      entities: [User],
      synchronize: true, // Fix me : set this value to false when deploy
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
