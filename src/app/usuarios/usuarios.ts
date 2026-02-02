import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FinanzasService } from '../services/finanzas.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  standalone: false,
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css',
})
export class Usuarios implements OnInit {
  usuarios!: Array<any>;
  public dataSource!: MatTableDataSource<any>;
  public displayedColumns: string[] = ['username', 'email', 'rol', 'acciones'];

  filterForm = new FormGroup({
    username: new FormControl(''),
    email: new FormControl(''),
    rol: new FormControl('')
  });

  /*Decorador que permite acceder a los componentes hijos del DOM*/
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private finanzasService: FinanzasService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.finanzasService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.dataSource = new MatTableDataSource(this.usuarios);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.setupFilter();
      },
      error: (err) => console.log(err),
    });

    this.filterForm.valueChanges.subscribe(() => {
      this.applyFilter();
    });
  }

  setupFilter() {
    this.dataSource.filterPredicate = (data: any, filterStr: string) => {
      const filter = JSON.parse(filterStr);
      const matchUsername = !filter.username || data.username.toLowerCase().includes(filter.username.toLowerCase());
      const matchEmail = !filter.email || data.email.toLowerCase().includes(filter.email.toLowerCase());
      const matchRol = !filter.rol || (data.perfil?.nombre && data.perfil.nombre.toLowerCase().includes(filter.rol.toLowerCase()));
      return matchUsername && matchEmail && matchRol;
    };
  }

  applyFilter() {
    this.dataSource.filter = JSON.stringify(this.filterForm.value);
  }

  limpiarFiltros() {
    this.filterForm.reset({
      username: '',
      email: '',
      rol: ''
    });
  }



  eliminarUsuario(usuario: any): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `Vas a eliminar al usuario: ${usuario.username}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#3b82f6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Pendiente', 'La función de eliminar usuarios aún no está implementada en el backend', 'info');
        // TODO: Implementar eliminación cuando exista el endpoint
        // this.usuariosService.eliminarUsuario(usuario.id).subscribe(...);
      }
    });
  }
}
