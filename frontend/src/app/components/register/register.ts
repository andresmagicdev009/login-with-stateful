import { Component, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from 'express';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  // Inicializar el formulario reactivo con las valicdaciones requeridas 
  registerForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  errorMessage: string | null = null;
  successMessage: string | null = null;
  isLoading = false;

  onSubmit(): void {
    if(this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    this.authService.register(this.registerForm.value).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = '!Cuenta creada con exito! Redirigiendo al inicio de sesion Bro ...'
        this.registerForm.reset();

        // Esperar 2 segundos antes de redirigir al login
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        this.isLoading = false;

        // Control de errores de acuerdo a los escenarios BDD del backend 
        if(err.status === 409) {
          this.errorMessage = 'El correo ya esta registrado. Intenta con otro.';
        } else if(err.status === 400) {
          this.errorMessage = 'Datos invalidos brother. Asegurate de llenar todos los campos correctamente.';
        }else {
          this.errorMessage = 'Ocurrio un error en el servidor. Intentalo de nuevo...'
        }
        console.error('Error en el registro:', err);
      }
    });
  }

  // Getters para manejar la visualizacion de errores individuales en el formulario
  get nameInvalid(): boolean{
    const control = this.registerForm.get('name');
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  get emailInvalid(): boolean {
    const control = this.registerForm.get('email');
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  get passwordInvalid(): boolean{
    const control = this.registerForm.get('password');
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}
