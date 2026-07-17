import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/auth.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';


// Es importante importar las librerias bcrypt o bcryptjs para poder hashear las contraseñas de los usuarios antes de guardarlas en la base de datos. Esto es una medida de seguridad para proteger la información sensible de los usuarios.
// Investigar como implementar bcrypt en NestJS y como funciona el proceso de hashing y salting de contraseñas para entender mejor la seguridad en aplicaciones web.
// Investigar Inject Repository y como funciona la inyeccion de dependencias en NestJS para poder utilizar el repositorio de la entidad User en el servicio AuthService. Esto permite realizar operaciones de base de datos de manera eficiente y segura, siguiendo las buenas practicas de desarrollo en NestJS.


@Injectable()
export class AuthService {

  constructor(

    // Inteccion de dependencias del respositorio de TypeORM 
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ){}


  // Funcion para validar y logear usuario 
  async login(loginAuthDto: LoginAuthDto) {
    const {email , password} = loginAuthDto;

    // Buscar el usuario por email 
    // Primera opcion haciendo uso de findOneBy
    /**const existingUser = await this.userRepository.findOne(
      
      {where:{ email },
      select: {
        id: true,
        nombre: true,
        username: true,
        email: true,
        passwordHash: true, // Selecciona el hash de la contraseña para poder compararlo con la contraseña ingresada por el usuario
        createdAt: true,
      }    
    });*/

    // Segunda opcion haciendo uso QueryBuilder opcion mas escalable y flexible para consultas complejas
    const existingUser = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', {email})
      .addSelect('user.passwordHash') // Selecciona el hash de la contraseña para poder compararlo con la contraseña ingresada por el usuario
      .getOne();

    // Control de errores (Si no existe el usuario) 
    // Investigar como funcionan las excepciones en NestJS y como se pueden personalizar para manejar errores de manera efectiva en la aplicación. Esto es importante para proporcionar una experiencia de usuario clara y comprensible, así como para mantener la seguridad y la integridad de la aplicación.
    if(!existingUser) {
       throw new UnauthorizedException('Credenciales inválidas');
    } 

    // Comparar la contraseña ingresada con el Hash de la contraseña almacenada en la base de datos
    const isPasswordValid = await bcrypt.compare(password, existingUser.passwordHash);
    if(!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Retornar limpio usando destructuring para no exponer el hash de la contraseña en la respuesta
    const { passwordHash: _, ...userWithouthPassword } = existingUser;
    return userWithouthPassword;

  }



  // Estudiar esta funcion para registrar un usuario 
  async register(createAuthDto: CreateAuthDto): Promise<Omit<User, 'passwordHash'>> {
    const { name, email, password } = createAuthDto;

    // 1. Validar si el usuario ya existe
    const existingUser = await this.userRepository.findOne({ where: {email}});
    if(existingUser) {
      throw new ConflictException('El correo electronico ya esta registrado');
    }

    // 2. Hashear la contraseña con salt rounds = 12 y bcrypt para proteger la contraseña del usuario antes de guardarla en la base de datos. Esto es una medida de seguridad para proteger la información sensible de los usuarios y evitar que las contraseñas sean expuestas en caso de un ataque a la base de datos.
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // 3. Crear la instancia de la entidad y guardar en la base de datos
    const newUser = this.userRepository.create({
      nombre: name,
      email, 
      passwordHash,
    })

    const savedUser = await this.userRepository.save(newUser);

    // 4. Retornar los datos del usuario sin exponer el hash de la contraseña
    const { passwordHash: _, ...userWithouthPassword} = savedUser;
    return userWithouthPassword;

  }

  findAll() {
    return `This action returns all auth`;
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id }});
    if(!user){
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return user;

  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
