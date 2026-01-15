import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Auth } from '../services/auth';
import { Observable } from 'rxjs';

@Injectable()
export class AuthorizationGuard {
  constructor(
    private auth: Auth,
    private router: Router,
  ) { }

  // Método que se ejecuta para determinar el rol de autenticacion
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.auth.isAuthenticated()) {
      let requiredRoles = route.data['roles'];
      let userRole = this.auth.getRole();
      if (userRole && requiredRoles.includes(userRole)) {
        return true;
      }
    }
    return false;
  }
}
