import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario, Pago } from '../models/usuarios.model';
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

  public getAllPagos(): Observable<Array<Pago>> {
    return this.http.get<Array<Pago>>(`${environment.backendHost}/pagos`);
  }

  public getAllUsuarios(): Observable<Array<Usuario>> {
    return this.http.get<Array<Usuario>>(`${environment.backendHost}/api/usuarios`);
  }

  public getPagosDeUsuario(username: string): Observable<Array<Pago>> {
    return this.http.get<Array<Pago>>(`${environment.backendHost}/api/finanzas/${username}`);
  }

  public guardarPago(formData: any): Observable<Pago> {
    return this.http.post<Pago>(`${environment.backendHost}/pagos`, formData);
  }
}
