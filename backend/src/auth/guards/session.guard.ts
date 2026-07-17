// Importar librerias 
// Investigar can activate y como funciona la interfaz CanActivate en NestJS para poder implementar la lógica de autorización en el guardia de sesión. Esto es importante para proteger las rutas de la aplicación y garantizar que solo los usuarios autenticados puedan acceder a ellas.
// Inverstigar UnauthorizedException y como funciona la excepción UnauthorizedException en NestJS para poder manejar los errores de autorización de manera efectiva. Esto es importante para proporcionar una experiencia de usuario clara y comprensible, así como para mantener la seguridad y la integridad de la aplicación.


import { Injectable, ExecutionContext, CanActivate } from "@nestjs/common";
import { UnauthorizedException } from "@nestjs/common";


@Injectable()
export class SessionGuard implements CanActivate {
    // Metodo principal 
    // Investigar el metodo obligatorio canActivate(context: ExecutionContext) y como funciona el metodo canActivate en NestJS para poder implementar la lógica de autorización en el guardia de sesión. Esto es importante para proteger las rutas de la aplicación y garantizar que solo los usuarios autenticados puedan acceder a ellas.
    async canActivate(context: ExecutionContext): Promise<boolean> {
        // 1. Obtener el objeto request de express
        // Investigar como extraer el request usando el contexto de ejecucion
        
        const request = context.switchToHttp().getRequest();

        // 2. Verificar si existe la sesion en el request
        // Investigar si request.session existe y si tiene guardad la propiedad definida
        // en el login ejemplo request.session.userId`
        if(!request.session || !request.session.userId){
            throw new UnauthorizedException('Sesion no encontrada, por favor inicie sesión');
        }

        return true;
    }

}