import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  // Definición del Formulario Reactivo con validaciones iniciales en el cliente
  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  errorMessage: string | null = null;
  isLoading = false;

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = null; // Limpiar errores previos

    const credentials = this.loginForm.value;

    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('Login exitoso:', response);
        // Redirigir al Dashboard una vez la sesión esté activa y guardada
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        
        // Manejo de errores según las respuestas de nuestro NestJS
        if (err.status === 401) {
          // Requisito BDD: Mensaje genérico para no dar pistas a atacantes
          this.errorMessage = 'Correo o contraseña incorrectos.';
        } else if (err.status === 429) {
          // Requisito BDD: Bloqueo temporal por demasiados intentos
          this.errorMessage = 'Demasiados intentos fallidos. Por favor, intenta de nuevo más tarde.';
        } else {
          this.errorMessage = 'Ocurrió un error inesperado en el servidor. Intenta de nuevo.';
        }
        
        console.error('Error en login:', err);
      }
    });
  }

  // Getters prácticos para mostrar mensajes de error visuales en los inputs
  get emailInvalid(): boolean {
    const control = this.loginForm.get('email');
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  get passwordInvalid(): boolean {
    const control = this.loginForm.get('password');
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}