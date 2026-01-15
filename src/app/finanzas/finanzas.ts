import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FinanzasService } from '../services/finanzas.service';
import { Auth } from '../services/auth';
import { Finanza } from '../models/estudiantes.model';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-finanzas',
    standalone: false,
    templateUrl: './finanzas.html',
    styleUrl: './finanzas.css',
})
export class Finanzas implements OnInit {
    public finanzas: Array<Finanza> = [];
    public dataSource!: MatTableDataSource<Finanza>;
    public displayedColumns = ['fecha', 'concepto', 'cantidad', 'tipo', 'medio', 'acciones'];

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(
        private finanzasService: FinanzasService,
        private auth: Auth
    ) { }

    ngOnInit(): void {
        const username = this.auth.getUsername();
        if (username) {
            this.loadFinanzas(username);
        }
    }

    loadFinanzas(username: string): void {
        this.finanzasService.getFinanzasByUsuario(username).subscribe({
            next: (data) => {
                this.finanzas = data;
                this.dataSource = new MatTableDataSource(this.finanzas);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
            },
            error: (err) => {
                console.error('Error cargando finanzas:', err);
            },
        });
    }

    agregarConcepto() {
        Swal.fire({
            title: 'Nuevo Concepto',
            input: 'text',
            inputLabel: 'Nombre del concepto',
            inputPlaceholder: 'Ingresa el nuevo concepto',
            showCancelButton: true,
            confirmButtonText: 'Agregar',
            cancelButtonText: 'Cancelar',
            inputValidator: (value) => {
                if (!value) {
                    return 'Debes ingresar un nombre';
                }
                return null;
            }
        }).then((result) => {
            if (result.isConfirmed) {
                this.finanzasService.addConcepto({ nombre: result.value }).subscribe({
                    next: () => {
                        Swal.fire('Guardado', 'El concepto ha sido agregado', 'success');
                    },
                    error: (err) => {
                        console.error(err);
                        Swal.fire('Error', 'No se pudo guardar el concepto', 'error');
                    }
                });
            }
        });
    }

    downloadFile(id: number): void {
        this.finanzasService.getArchivoFinanza(id).subscribe({
            next: (blob) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `finanza_${id}.pdf`;
                a.click();
                window.URL.revokeObjectURL(url);
            },
            error: (err) => {
                console.error('Error descargando archivo:', err);
            }
        });
    }

    eliminarFinanza(finanza: Finanza) {
        Swal.fire({
            title: '¿Estás seguro?',
            text: `Vas a eliminar el registro: ${finanza.concepto}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#3b82f6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                this.finanzasService.eliminarFinanza(finanza.id).subscribe({
                    next: () => {
                        Swal.fire('Eliminado', 'El registro ha sido eliminado', 'success');
                        const username = this.auth.getUsername();
                        if (username) this.loadFinanzas(username);
                    },
                    error: (err) => {
                        console.error(err);
                        Swal.fire('Error', 'No se pudo eliminar el registro', 'error');
                    }
                });
            }
        });
    }
}
