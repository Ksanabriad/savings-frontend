import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FinanzasService } from '../services/finanzas.service';
import { Auth } from '../services/auth';
import { HistorialInforme } from '../models/usuarios.model';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
    selector: 'app-historial-informes',
    standalone: false,
    templateUrl: './historial-informes.html',
    styleUrl: './historial-informes.css'
})
export class HistorialInformes implements OnInit {
    public dataSource!: MatTableDataSource<HistorialInforme>;
    public displayedColumns = ['usuario', 'fechaGeneracion', 'nombreArchivo', 'acciones'];

    public meses = [
        { value: 1, name: 'Enero' }, { value: 2, name: 'Febrero' }, { value: 3, name: 'Marzo' },
        { value: 4, name: 'Abril' }, { value: 5, name: 'Mayo' }, { value: 6, name: 'Junio' },
        { value: 7, name: 'Julio' }, { value: 8, name: 'Agosto' }, { value: 9, name: 'Septiembre' },
        { value: 10, name: 'Octubre' }, { value: 11, name: 'Noviembre' }, { value: 12, name: 'Diciembre' }
    ];

    public anioActual = new Date().getFullYear();
    public anios = [this.anioActual, this.anioActual - 1];

    public selectedMes: number = new Date().getMonth() + 1;
    public selectedAnio: number = this.anioActual;

    // Filters
    public filterUsername: string = '';
    public filterMes: number | null = null;
    public filterAnio: number | null = null;

    // Admin Generation
    public targetUser: string = '';
    public userControl = new FormControl('');
    public allUsers: string[] = [];
    public filteredUsers!: Observable<string[]>;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(private finanzasService: FinanzasService, public authService: Auth, private router: Router) { }

    ngOnInit(): void {
        if (!this.authService.isAdmin()) {
            this.displayedColumns = this.displayedColumns.filter(c => c !== 'usuario');
        }
        this.loadHistorial();

        // Cargar usuarios para el autocompletado si es administrador
        if (this.authService.isAdmin()) {
            this.finanzasService.getUsuarios().subscribe(users => {
                this.allUsers = users.map((u: any) => u.username);

                // Configurar el filtrado de autocompletado
                this.filteredUsers = this.userControl.valueChanges.pipe(
                    startWith(''),
                    map(value => this._filterUsers(value || ''))
                );
            });
        }
    }

    private _filterUsers(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.allUsers.filter(user => user.toLowerCase().includes(filterValue));
    }

    loadHistorial(): void {
        const username = this.authService.isAdmin() ? undefined : this.authService.getUsername();
        this.finanzasService.getHistorialInformes(username || undefined).subscribe({
            next: (data) => {
                this.dataSource = new MatTableDataSource(data);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;

                // Predicado de filtro personalizado
                this.dataSource.filterPredicate = (data: HistorialInforme, filter: string) => {
                    const searchTerms = JSON.parse(filter);

                    const userMatch = searchTerms.username ? (data.usuario?.username || '').toLowerCase().includes(searchTerms.username.toLowerCase()) : true;

                    let monthMatch = true;
                    let yearMatch = true;

                    if (data.fechaGeneracion) {
                        const date = new Date(data.fechaGeneracion);
                        // El mes está indexado en 0 en JS, ¡así que +1!
                        monthMatch = searchTerms.month ? (date.getMonth() + 1) == searchTerms.month : true;
                        yearMatch = searchTerms.year ? date.getFullYear() == searchTerms.year : true;
                    }

                    return userMatch && monthMatch && yearMatch;
                };
            },
            error: (err) => {
                console.error('Error cargando historial:', err);
                Swal.fire('Error', 'No se pudo cargar el historial de informes', 'error');
            }
        });
    }

    applyFilter(): void {
        const filterValues = {
            username: this.filterUsername,
            month: this.filterMes,
            year: this.filterAnio
        };
        this.dataSource.filter = JSON.stringify(filterValues);

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    generarExtracto(): void {
        let username = this.authService.getUsername();

        if (this.authService.isAdmin()) {
            const selectedUser = this.userControl.value;
            if (!selectedUser) {
                Swal.fire('Atención', 'Debe especificar el usuario para el cual generar el informe.', 'warning');
                return;
            }
            username = selectedUser;
        }

        if (!username) return;

        Swal.fire({
            title: 'Generando Extracto...',
            text: 'Por favor espere',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        this.finanzasService.generarInformeMensual(username, this.selectedMes, this.selectedAnio).subscribe({
            next: () => {
                Swal.fire('Éxito', 'Extracto generado correctamente', 'success');
                this.loadHistorial();
            },
            error: (err) => {
                console.error('Error generando extracto:', err);
                const errorMessage = err.error?.message || err.error || 'No se pudo generar el extracto';
                Swal.fire('Error', errorMessage, 'error');
            }
        });
    }

    descargarInforme(id: number, nombreArchivo: string) {
        this.finanzasService.descargarInforme(id).subscribe({
            next: (blob) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = nombreArchivo;
                a.click();
                window.URL.revokeObjectURL(url);
            },
            error: (err) => {
                console.error('Error descargando informe:', err);
                Swal.fire('Error', 'No se pudo descargar el archivo', 'error');
            }
        });
    }

    getDisplayFilename(nombreArchivo: string, username: string | undefined): string {
        if (!nombreArchivo) return '';
        if (username && nombreArchivo.startsWith(username + '_')) {
            return nombreArchivo.replace(username + '_', 'EasySave_');
        }
        return nombreArchivo;
    }

    eliminarInforme(id: number, nombreArchivo: string): void {
        Swal.fire({
            title: '¿Eliminar informe?',
            text: `Se eliminará el informe ${nombreArchivo}. Podrá regenerarlo después.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                this.finanzasService.eliminarInforme(id).subscribe({
                    next: () => {
                        Swal.fire('Eliminado', 'El informe ha sido eliminado correctamente', 'success');
                        this.loadHistorial();
                    },
                    error: (err: any) => {
                        console.error('Error eliminando informe:', err);
                        Swal.fire('Error', 'No se pudo eliminar el informe', 'error');
                    }
                });
            }
        });
    }

    goBack() {
        const username = this.authService.getUsername();
        if (username) {
            this.router.navigate([`/${username}/finanzas`]);
        }
    }
}
