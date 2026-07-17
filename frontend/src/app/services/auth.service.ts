import { inject, Injectable, signal } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, tap, catchError, throwError} from 'rxjs';

export interface User {
  id?: string;
  name?: string;
  email?: string;
}

// Analizar y entender bien este codigo 


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:3000/auth';
  
  // Usar signals (Angular 16) para manejar el estado del usuario reactivamente
  currentUser = signal<User | null>(null);
  isAuthenticated = signal<boolean>(false);

  // REgistro de Usuario
  register(userData: {name: string, email: string; password: string}): Observable<any> {
    return this.http.post(`${this.API_URL}/register`, userData);
  }

  // Inicio de Sesion
  login(credentials: {email: string; password: string}): Observable<any> {
    return this.http.post(`${this.API_URL}/login`, credentials, {withCredentials: true}).pipe(
      tap((response: any) => {
        // Actualizar el estado del usuario y la autenticacion
        this.currentUser.set(response.user);
        this.isAuthenticated.set(true);
      }),
      catchError((error) => {
        console.error('Login error:', error);
        return throwError(() => new Error('Login failed'));
      })
    );
  }

  // Verificar Estado de Sesion ( Se ejecuta al recargar la pagina para mantener la sesion activa)
  checkStatus(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/status`).pipe(
      tap(response => {
        this.currentUser.set(response.user);
        this.isAuthenticated.set(false);
      }),
      catchError((error) => {
        // Si responde 401, la sesion no es valida o expiro 
        this.currentUser.set(null);
        this.isAuthenticated.set(false);
        return throwError(() => new Error('Session check failed'));
      })
    );
  }

  // Cerrar Sesion
  logout(): Observable<any>{
    return this.http.post(`${this.API_URL}/logout`, {}).pipe(
      tap(() => {
        this.currentUser.set(null);
        this.isAuthenticated.set(false);
      })
    );
  }

}
