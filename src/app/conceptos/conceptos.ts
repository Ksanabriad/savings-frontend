import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FinanzasService } from '../services/finanzas.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-conceptos',
    standalone: false,
    templateUrl: './conceptos.html',
})
export class Conceptos implements OnInit {
    public conceptos: any[] = [];
    public dataSource!: MatTableDataSource<any>;
    public displayedColumns = ['nombre', 'acciones'];

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(private finanzasService: FinanzasService) { }

    ngOnInit(): void {
        this.loadConceptos();
    }

    loadConceptos(): void {
        this.finanzasService.getConceptos().subscribe({
            next: (data) => {
                this.conceptos = data;
                this.dataSource = new MatTableDataSource(this.conceptos);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
            },
            error: (err) => {
                console.error('Error cargando conceptos:', err);
            },
        });
    }

    nuevoConcepto(): void {
        Swal.fire({
            title: 'Nuevo Concepto',
            input: 'text',
            inputLabel: 'Nombre del concepto',
            showCancelButton: true,
            confirmButtonText: 'Guardar',
            cancelButtonText: 'Cancelar',
            inputValidator: (value) => {
                if (!value) return 'El nombre es obligatorio';
                if (value.length < 3) return 'El nombre debe tener al menos 3 caracteres';
                if (value.length > 50) return 'El nombre no puede exceder 50 caracteres';
                if (!/^[a-zA-Z0-9\sáéíóúÁÉÍÓÚñÑ]+$/.test(value)) return 'Solo se permiten letras, números y espacios';
                return null;
            }
        }).then((result) => {
            if (result.isConfirmed) {
                this.finanzasService.addConcepto({ nombre: result.value }).subscribe({
                    next: () => {
                        Swal.fire('Guardado', 'Concepto creado exitosamente', 'success');
                        this.loadConceptos();
                    },
                    error: () => Swal.fire('Error', 'No se pudo crear el concepto', 'error')
                });
            }
        });
    }

    editarConcepto(concepto: any): void {
        Swal.fire({
            title: 'Editar Concepto',
            input: 'text',
            inputLabel: 'Nombre del concepto',
            inputValue: concepto.nombre,
            showCancelButton: true,
            confirmButtonText: 'Guardar',
            cancelButtonText: 'Cancelar',
            inputValidator: (value) => {
                if (!value) return 'El nombre es obligatorio';
                if (value.length < 3) return 'El nombre debe tener al menos 3 caracteres';
                if (value.length > 50) return 'El nombre no puede exceder 50 caracteres';
                if (!/^[a-zA-Z0-9\sáéíóúÁÉÍÓÚñÑ]+$/.test(value)) return 'Solo se permiten letras, números y espacios';
                return null;
            }
        }).then((result) => {
            if (result.isConfirmed) {
                this.finanzasService.updateConcepto(concepto.id, { nombre: result.value }).subscribe({
                    next: () => {
                        Swal.fire('Actualizado', 'Concepto actualizado exitosamente', 'success');
                        this.loadConceptos();
                    },
                    error: () => Swal.fire('Error', 'No se pudo actualizar el concepto', 'error')
                });
            }
        });
    }

    eliminarConcepto(id: number): void {
        Swal.fire({
            title: '¿Eliminar concepto?',
            text: 'Esta acción no se puede deshacer',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                this.finanzasService.eliminarConcepto(id).subscribe({
                    next: () => {
                        Swal.fire('Eliminado', 'El concepto ha sido eliminado', 'success');
                        this.loadConceptos();
                    },
                    error: () => Swal.fire('Error', 'El concepto podría estar en uso', 'error')
                });
            }
        });
    }
}
