import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Auth } from '../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  public loginForm!: FormGroup; // Formulario Reactivo

  constructor(
    private formBuilder: FormBuilder,
    private auth: Auth,
    private router: Router,
  ) { } // Inyecta FormBuilder

  // Se ejecuta al inicializar el componente
  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: this.formBuilder.control(''),
      password: this.formBuilder.control(''),
    });
  }

  login(): void {
    let username = this.loginForm.value.username;
    let password = this.loginForm.value.password;
    this.auth.login(username, password).subscribe(success => {
      if (success) {
        this.router.navigateByUrl('/admin/dashboard');
      } else {
        alert('Credenciales incorrectas');
      }
    });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
