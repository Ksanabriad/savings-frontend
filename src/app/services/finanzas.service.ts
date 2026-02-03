import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Finanza } from '../models/usuarios.model';
import { environment } from '../../environments/environment.development';

@Injectable({
    providedIn: 'root',
})
export class FinanzasService {
    constructor(private http: HttpClient) { }

    public getConceptos(): Observable<Array<any>> {
        return this.http.get<Array<any>>(`${environment.backendHost}/api/conceptos`);
    }

    public addConcepto(concepto: any): Observable<any> {
        return this.http.post<any>(`${environment.backendHost}/api/conceptos`, concepto);
    }

    public updateConcepto(id: number, concepto: any): Observable<any> {
        return this.http.put<any>(`${environment.backendHost}/api/conceptos/${id}`, concepto);
    }

    public eliminarConcepto(id: number): Observable<void> {
        return this.http.delete<void>(`${environment.backendHost}/api/conceptos/${id}`);
    }

    public getFinanzasByUsuario(username: string): Observable<Array<Finanza>> {
        return this.http.get<Array<Finanza>>(`${environment.backendHost}/api/finanzas/${username}`);
    }

    public getAllFinanzas(): Observable<Array<Finanza>> {
        return this.http.get<Array<Finanza>>(`${environment.backendHost}/api/finanzas`);
    }

    public guardarFinanza(formData: FormData): Observable<Finanza> {
        return this.http.post<Finanza>(`${environment.backendHost}/api/finanzas`, formData);
    }

    public getArchivoFinanza(id: number): Observable<Blob> {
        return this.http.get(`${environment.backendHost}/api/finanzas/archivo/${id}`, {
            responseType: 'blob'
        });
    }

    public getFinanza(id: number): Observable<Finanza> {
        return this.http.get<Finanza>(`${environment.backendHost}/api/finanzas/detail/${id}`);
    }

    public actualizarFinanza(id: number, formData: FormData): Observable<Finanza> {
        return this.http.put<Finanza>(`${environment.backendHost}/api/finanzas/${id}`, formData);
    }

    public eliminarFinanza(id: number): Observable<void> {
        return this.http.delete<void>(`${environment.backendHost}/api/finanzas/${id}`);
    }

    public getUsuarios(): Observable<Array<any>> {
        return this.http.get<Array<any>>(`${environment.backendHost}/api/usuarios`);
    }

    public getHistorialInformes(username?: string): Observable<Array<any>> {
        const url = username ? `${environment.backendHost}/api/informes?username=${username}` : `${environment.backendHost}/api/informes`;
        return this.http.get<Array<any>>(url);
    }

    public generarInformeMensual(username: string, mes: number, anio: number): Observable<any> {
        return this.http.post<any>(`${environment.backendHost}/api/informes/generar?username=${username}&mes=${mes}&anio=${anio}`, {});
    }

    public descargarInforme(id: number): Observable<Blob> {
        return this.http.get(`${environment.backendHost}/api/informes/descargar/${id}`, {
            responseType: 'blob'
        });
    }

    public getTipos(): Observable<Array<any>> {
        return this.http.get<Array<any>>(`${environment.backendHost}/api/finanzas/tipos`);
    }

    public getMedios(): Observable<Array<any>> {
        return this.http.get<Array<any>>(`${environment.backendHost}/api/finanzas/medios`);
    }
    public eliminarUsuario(username: string): Observable<void> {
        return this.http.delete<void>(`${environment.backendHost}/api/usuarios/${username}`);
    }

    public getBalance(username: string): Observable<number> {
        return this.http.get<number>(`${environment.backendHost}/api/finanzas/${username}/balance`);
    }

    public getLast3MonthsExpenses(username: string): Observable<Array<any>> {
        return this.http.get<Array<any>>(`${environment.backendHost}/api/finanzas/${username}/expenses-last-3-months`);
    }

    public getLast3MonthsIncome(username: string): Observable<Array<any>> {
        return this.http.get<Array<any>>(`${environment.backendHost}/api/finanzas/${username}/income-last-3-months`);
    }

    public getCurrentMonthIncome(username: string): Observable<number> {
        return this.http.get<number>(`${environment.backendHost}/api/finanzas/${username}/current-month-income`);
    }

    public getCurrentMonthExpenses(username: string): Observable<number> {
        return this.http.get<number>(`${environment.backendHost}/api/finanzas/${username}/current-month-expenses`);
    }

    public getCategoryDistribution(username: string): Observable<Array<any>> {
        return this.http.get<Array<any>>(`${environment.backendHost}/api/finanzas/${username}/category-distribution`);
    }

    public getRecentTransactions(username: string): Observable<Array<any>> {
        return this.http.get<Array<any>>(`${environment.backendHost}/api/finanzas/${username}/recent`);
    }
}
