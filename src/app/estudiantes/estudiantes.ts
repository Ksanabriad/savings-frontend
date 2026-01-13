import { Component, OnInit, ViewChild } from '@angular/core';
import { Estudiante } from '../models/estudiantes.model';
import { EstudiantesService } from '../services/estudiantes.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-estudiantes',
  standalone: false,
  templateUrl: './estudiantes.html',
  styleUrl: './estudiantes.css',
})
export class Estudiantes implements OnInit {
  estudiantes!: Array<Estudiante>;
  public dataSource: any;
  public displayedColumns: string[] = ['id', 'nombre', 'apellido', 'codigo', 'programaId', 'pagos'];

  /*Decorador que permite acceder a los componentes hijos del DOM*/
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private estudiantesServices: EstudiantesService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.estudiantesServices.getAllEstudiantes().subscribe({
      next: (data) => {
        this.estudiantes = data;
        this.dataSource = new MatTableDataSource(this.estudiantes);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => console.log(err),
    });
  }

  listarPagosDeEstudiante(estudiante: Estudiante) {
    this.router.navigateByUrl(`/admin/estudiante-detalles/${estudiante.codigo}`);
  }
}
