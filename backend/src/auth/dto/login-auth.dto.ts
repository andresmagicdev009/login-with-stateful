import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator'

// Inverstigar class validator y class transformer son las librerias estandar en NestJS para validar decoradores
// Entender y aprender a activar ValidationPipe global en el main.ts para que se apliquen las validaciones de los decoradores en los DTOs


export class LoginAuthDto {

    @ApiProperty({
        description: 'Correo electrónico del usuario',
        example: 'mrrobot@gmail.com'
    })
    // 1. CAMPO CORREO 
    // Investigar que son los decoradores y como funcionan en TypeScript
    @IsEmail() // Verifica que tenga el formato correcto de correo
    @IsNotEmpty() // Verifica que no sea un campo vacio
    email!: string;
    @ApiProperty({
        description: 'Contraseña del usuario',
        example: 'SecurePass123!'
    })
    // 2. CAMPO CONTRASEÑA
    @IsString() // Verifica que sea un string
    @IsNotEmpty() // Verifica que no sea un campo vacio
    @MinLength(6) // Verifica que tenga al menos 6 caracteres
    password!: string;

}