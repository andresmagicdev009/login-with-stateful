import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Session, UseGuards, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginAuthDto } from './dto/login-auth.dto';
import { SessionGuard } from './guards/session.guard';


@ApiTags('auth') // Etiqueta para Swagger
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos.' })
  @ApiResponse({ status: 409, description: 'El correo ya está registrado.' })
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.register(createAuthDto);
  }

  //Controlador para el login de usuario y creación de sesión
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'Inicio de sesión exitoso.' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas.' })
  async login(
    @Body() LoginAuthDto: LoginAuthDto,
    @Session() session: Record<string, any> // NestJS inyecta la sesion de Express aqui
  ) {
    // Validar las credenciales en el servicio 
    const user = await this.authService.login(LoginAuthDto);

    // Crear la sesion 
    // Al asignarla propiedad, express-session se activa, se guarda en la DATABASE y se envia la cookie al cliente
    session.userId = user.id;

    return {
      message: 'Inicio de sesión exitoso',
      user: {
        id: user.id,
        email: user.email,
      }
    }
  }

  // Endpoint para verificar estado (mantener sesion)
  @Get('status')
  @UseGuards(SessionGuard) // Investigar como aplicar un guard para que solo pasen uuarios con sesion activa
  async getStatus(@Session() session: {userId?: string}) {
    // Obtener el ID de la sesion
    const userId = session.userId;

    // Verificar que la sesion tenga un ID de usuario
    if(!userId){
      throw new UnauthorizedException('Sesion no encontrada, por favor inicie sesión');
    }

    // Buscar el usuario en la base de datos 
    /// Investigar como crear un metodo en el AuthService para buscar un usuario por ID y retornar sus datos
    const user = await this.authService.findOne(userId);

    // Retornar los datos del usuario 
    return {
      message: 'Sesión activa',
      user: {
        name: user.nombre,
        email: user.email,
      }
    }

  }
  

}