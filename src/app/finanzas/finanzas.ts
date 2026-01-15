import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FinanzasService } from '../services/finanzas.service';
import { Auth } from '../services/auth';
import { Finanza } from '../models/usuarios.model';
import Swal from 'sweetalert2';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as XLSX from 'xlsx';

@Component({
    selector: 'app-finanzas',
    standalone: false,
    templateUrl: './finanzas.html',
    styleUrl: './finanzas.css',
})
export class Finanzas implements OnInit {
    public finanzas: Array<Finanza> = [];
    public dataSource!: MatTableDataSource<Finanza>;
    public displayedColumns = ['usuario', 'fecha', 'concepto', 'cantidad', 'tipo', 'medio', 'acciones'];
    public usuarios: any[] = [];

    filterForm = new FormGroup({
        usuario: new FormControl(''),
        fechaDesde: new FormControl<Date | null>(null),
        fechaHasta: new FormControl<Date | null>(null),
    });

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(
        private finanzasService: FinanzasService,
        public auth: Auth,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.loadFinanzas();
        if (this.auth.isAdmin()) {
            this.finanzasService.getUsuarios().subscribe(data => this.usuarios = data);
        }

        // Detectar si venimos de la pantalla de Usuarios con un filtro preestablecido
        this.route.queryParams.subscribe(params => {
            if (params['usuario']) {
                this.filterForm.patchValue({ usuario: params['usuario'] });
                // applyFilter se disparará por el valueChanges subscription de abajo
            }
        });

        this.filterForm.valueChanges.subscribe(() => {
            this.applyFilter();
        });
    }

    applyFilter() {
        if (!this.dataSource) return;

        const filters = this.filterForm.value;

        this.dataSource.filterPredicate = (data: Finanza, filterStr: string) => {
            const filter = JSON.parse(filterStr);

            // Filtro por usuario (username)
            const matchUsuario = !filter.usuario || data.usuario?.username === filter.usuario;

            // Filtro por fecha
            const fechaData = new Date(data.fecha);
            fechaData.setHours(0, 0, 0, 0);

            const matchDesde = !filter.fechaDesde || fechaData >= new Date(filter.fechaDesde);
            const matchHasta = !filter.fechaHasta || fechaData <= new Date(filter.fechaHasta);

            return matchUsuario && matchDesde && matchHasta;
        };

        this.dataSource.filter = JSON.stringify(filters);
    }

    loadFinanzas(): void {
        const username = this.auth.getUsername();
        if (!username) return;

        const request = this.auth.isAdmin()
            ? this.finanzasService.getAllFinanzas()
            : this.finanzasService.getFinanzasByUsuario(username);

        request.subscribe({
            next: (data) => {
                this.finanzas = data;
                this.dataSource = new MatTableDataSource(this.finanzas);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;

                // Configurar sort para campos anidados
                this.dataSource.sortingDataAccessor = (item, property) => {
                    switch (property) {
                        case 'usuario': return item.usuario?.username;
                        default: return (item as any)[property];
                    }
                };

                this.applyFilter();
            },
            error: (err) => {
                console.error('Error cargando finanzas:', err);
            },
        });
    }

    limpiarFiltros() {
        this.filterForm.reset({
            usuario: '',
            fechaDesde: null,
            fechaHasta: null
        });
    }

    exportToExcel() {
        // Obtenemos los datos que están actualmente en el dataSource después del filtro
        const dataToExport = this.dataSource.filteredData.map(item => ({
            Usuario: item.usuario?.username || 'N/A',
            Fecha: item.fecha,
            Concepto: item.concepto,
            Cantidad: item.cantidad,
            Tipo: item.tipo,
            Medio: item.medio
        }));

        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Finanzas');

        /* save to file */
        const timestamp = new Date().toISOString().split('T')[1].split('.')[0].replace(/:/g, '');
        const date = new Date().toISOString().split('T')[0];
        XLSX.writeFile(wb, `EasySave_${date}_${timestamp}.xlsx`);
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
                        if (username) this.loadFinanzas();
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
