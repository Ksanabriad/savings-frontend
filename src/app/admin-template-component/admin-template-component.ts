import { Component } from '@angular/core';
import { Auth } from '../services/auth';

@Component({
  selector: 'app-admin-template-component',
  standalone: false,
  templateUrl: './admin-template-component.html',
  styleUrl: './admin-template-component.css',
})
export class AdminTemplateComponent {
  constructor(public auth: Auth) { }

  getUsername(): string {
    return this.auth.getUsername() || 'admin';
  }

  logout() {
    this.auth.logout();
  }
}
