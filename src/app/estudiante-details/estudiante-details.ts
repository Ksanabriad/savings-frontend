import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { EstudiantesService } from '../services/estudiantes.service';
import { Pago } from '../models/estudiantes.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-estudiante-details',
  standalone: false,
  templateUrl: './estudiante-details.html',
  styleUrls: ['./estudiante-details.css'],
})
export class EstudianteDetails implements OnInit {
  estudianteCodigo = '';
  pagosEstudiante: Pago[] = [];
  pagosDataSource = new MatTableDataSource<Pago>([]);
  public displayedColumns: string[] = ['id', 'fecha', 'cantidad', 'type', 'status', 'nombre'];

  constructor(
    private activatedRoute: ActivatedRoute,
    private estudiantesServices: EstudiantesService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.estudianteCodigo = params['codigo'] || '';
      this.estudiantesServices.getPagosDeEstudiante(this.estudianteCodigo).subscribe({
        next: (data) => {
          this.pagosEstudiante = data || [];
          this.pagosDataSource.data = this.pagosEstudiante;
        },
        error: (err) => console.log(err),
      });
    });
  }

  agregarPago() {
    this.router.navigateByUrl(`/admin/new-pago/${this.estudianteCodigo}`);
  }
}
