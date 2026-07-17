// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { DashboardComponent } from './components/dashboard/dashboard';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  // 1. Ruta por defecto: Redirige al login
  { 
    path: '', 
    redirectTo: 'login', 
    pathMatch: 'full' 
  },

  // 2. Rutas Públicas de Autenticación
  { 
    path: 'login', 
    component: LoginComponent 
  },
  { 
    path: 'register', 
    component: RegisterComponent 
  },

  // 3. Ruta Privada/Protegida (Cumple con el escenario BDD)
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [authGuard] // El Guard validará la sesión en NestJS antes de dejarlo pasar
  },

  // 4. Ruta comodín en caso de URLs incorrectas (Redirige al login o a un 404)
  { 
    path: '**', 
    redirectTo: 'login' 
  }
];