import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import {User} from './auth/entities/auth.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'magic',
      database: 'auth_stateful_db',
      entities: [User],
      synchronize: true, // TRUE solo en desarrollo autocrea las tabla en la Base de datos 
    }),  
    AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
