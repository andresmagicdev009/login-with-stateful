import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, map, of } from 'rxjs';


export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si ya se sabe que el usuario esta autenticado, se permite el acceso 
  if(authService.isAuthenticated()){
    return true;
  }

  // Si no se sabe, se verifica el estado de la sesion preguntandole al backend si tiene una sesion activa. Esto es util para cuando se recarga la pagina y se pierde el estado del frontend.
  return authService.checkStatus().pipe(
    map(() => true), // Sesion valida en el servidor 
    catchError(() => {
      // Sesion invalida o expirada -> redirigir al login
      router.navigate(['/login']);
      return of(false);
    })
  )
};
