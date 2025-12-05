import { Component, OnInit } from '@angular/core';
import { Estudiante } from '../models/estudiantes.model';
import { EstudiantesService } from '../services/estudiantes.service';

@Component({
  selector: 'app-estudiantes',
  standalone: false,
  templateUrl: './estudiantes.html',
  styleUrl: './estudiantes.css',
})
export class Estudiantes implements OnInit {

  estudiantes!: Array<Estudiante>;
  constructor(private estudiantesServices: EstudiantesService) { }

  ngOnInit(): void {
    this.estudiantesServices.getAllEstudiantes().subscribe({
      next: value => {
        this.estudiantes = value;
      },
      error: err =>
        console.log(err)
    });
  }

}
