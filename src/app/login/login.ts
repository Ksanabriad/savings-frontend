import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Auth } from '../services/auth';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  public loginForm!: FormGroup; // Formulario Reactivo
  public submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private auth: Auth,
    private router: Router,
  ) { } // Inyecta FormBuilder

  // Se ejecuta al inicializar el componente
  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  login(): void {
    this.submitted = true;
    if (this.loginForm.valid) {
      let username = this.loginForm.value.username;
      let password = this.loginForm.value.password;
      this.auth.login(username, password).subscribe(success => {
        if (success) {
          const role = this.auth.getRole();
          if (role === 'ADMIN') {
            this.router.navigateByUrl(`/${username}/finanzas`);
          } else {
            this.router.navigateByUrl(`/${username}/dashboard`);
          }
        } else {
          Swal.fire({
            title: 'Error de acceso',
            text: 'Credenciales incorrectas. Por favor, verifica tu usuario o contraseña.',
            icon: 'error',
            confirmButtonText: 'Reintentar',
            confirmButtonColor: '#ef4444'
          });
        }
      });
    }
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  forgotPassword() {
    Swal.fire({
      title: 'Recuperar Contraseña',
      input: 'email',
      inputLabel: 'Correo electrónico',
      inputPlaceholder: 'Ingresa tu correo electrónico',
      showCancelButton: true,
      confirmButtonText: 'Enviar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#ef4444',
      inputValidator: (value) => {
        if (!value) {
          return '¡El correo electrónico es obligatorio!';
        }
        return null;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Solicitud Recibida',
          html: `
            <p style="margin: 0 0 0.5rem;">
              Hemos recibido tu solicitud para el correo <b>${result.value}</b>.
            </p>
            <p style="margin: 0;">
              Te escribiremos por correo electrónico en menos de <b>24 horas</b>.
            </p>
          `,
          icon: 'success',
          confirmButtonText: 'Entendido',
          confirmButtonColor: '#10b981'
        });
      }
    });
  }
}
