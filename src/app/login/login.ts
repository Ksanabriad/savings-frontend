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
    let auth: boolean = this.auth.login(username, password);
    if (auth == true) {
      this.router.navigateByUrl('/admin/dashboard');
    }
  }

  loginWithSocial(provider: string): void {
    let url = '';
    switch (provider) {
      case 'google':
        url = 'https://accounts.google.com/signin';
        break;
      case 'facebook':
        url = 'https://www.facebook.com/login';
        break;
      case 'apple':
        url = 'https://appleid.apple.com/sign-in';
        break;
    }
    if (url) {
      window.location.href = url;
    }
  }
}
