import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuarios.model';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  constructor(private http: HttpClient) { }

  public login(credentials: any): Observable<Usuario> {
    return this.http.post<Usuario>(`${environment.backendHost}/api/usuarios/login`, credentials);
  }

  public register(user: any): Observable<Usuario> {
    return this.http.post<Usuario>(`${environment.backendHost}/api/usuarios/register`, user);
  }


  public getAllUsuarios(): Observable<Array<Usuario>> {
    return this.http.get<Array<Usuario>>(`${environment.backendHost}/api/usuarios`);
  }

  public getUsuario(id: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${environment.backendHost}/api/usuarios/${id}`);
  }

  public updateUsuario(id: string, user: any): Observable<Usuario> {
    return this.http.put<Usuario>(`${environment.backendHost}/api/usuarios/${id}`, user);
  }

}
