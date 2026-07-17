import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container" style="max-width: 600px; margin: 50px auto; padding: 20px; font-family: sans-serif; border: 1px solid #e2e8f0; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
      <h2>Bienvenido al Dashboard Protegido</h2>
      
      <!-- Usamos el Signal de AuthService para mostrar el usuario en tiempo real -->
      <div *ngIf="authService.currentUser() as user; else loading" style="background-color: #edf2f7; padding: 15px; border-radius: 6px; margin: 20px 0;">
        <p><strong>Nombre:</strong> {{ user.name }}</p>
        <p><strong>Correo Electrónico:</strong> {{ user.email }}</p>
      </div>

      <ng-template #loading>
        <p>Cargando información del usuario...</p>
      </ng-template>

      <button (click)="onLogout()" style="background-color: #e53e3e; color: white; border: none; padding: 10px 15px; border-radius: 6px; cursor: pointer; font-weight: bold; width: 100%;">
        Cerrar Sesión
      </button>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  public authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit(): void {
    // Cuando el usuario entra al Dashboard, re-verificamos el estado en el servidor
    // por seguridad y para cargar la info más reciente
    this.authService.checkStatus().subscribe({
      error: () => {
        // Si hay error en la cookie/sesión, el Guard ya debería protegernos,
        // pero esto actúa como doble control reactivo.
        this.router.navigate(['/login']);
      }
    });
  }

  onLogout(): void {
    this.authService.logout().subscribe({
      next: () => {
        // Al destruir la sesión, redirigimos al login
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error al cerrar sesión:', err);
      }
    });
  }
}