import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { UsuariosService } from './usuarios.service';
import { Usuario } from '../models/usuarios.model';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  constructor(
    private router: Router,
    private apiService: UsuariosService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  public login(username: string, password: string): Observable<boolean> {
    return this.apiService.login({ username, password }).pipe(
      map((user: Usuario) => {
        if (user && isPlatformBrowser(this.platformId)) {
          localStorage.setItem('role', user.perfil?.nombre || 'USER');
          localStorage.setItem('username', user.username);
          return true;
        }
        return false;
      }),
      catchError(() => of(false))
    );
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('role');
      localStorage.removeItem('username');
    }
    this.router.navigateByUrl('/login');
  }

  public getRole(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('role');
    }
    return null;
  }

  public getUsername(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('username');
    }
    return null;
  }

  public isAdmin() {
    if (isPlatformBrowser(this.platformId)) {
      let role = localStorage.getItem('role');
      return role == 'ADMIN';
    }
    return false;
  }

  public isAuthenticated(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('username');
    }
    return false;
  }
}
