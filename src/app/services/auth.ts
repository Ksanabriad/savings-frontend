import { Injectable } from '@angular/core';
import { UsuariosService } from './usuarios.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  constructor(private router: Router, private apiService: UsuariosService) { }

  public login(username: string, password: string): Observable<boolean> {
    return this.apiService.login({ username, password }).pipe(
      map(user => {
        if (user) {
          localStorage.setItem('role', user.rol);
          localStorage.setItem('username', user.username);
          return true;
        }
        return false;
      }),
      catchError(() => of(false))
    );
  }

  logout() {
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    this.router.navigateByUrl('/login');
  }

  public getRole(): string | null {
    return localStorage.getItem('role');
  }

  public getUsername(): string | null {
    return localStorage.getItem('username');
  }

  public isAdmin() {
    let role = localStorage.getItem('role');
    return role == 'ADMIN';
  }

  public isAuthenticated(): boolean {
    return !!localStorage.getItem('username');
  }
}
