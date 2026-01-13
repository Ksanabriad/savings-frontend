import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PaymentType } from '../models/estudiantes.model';
import { EstudiantesService } from '../services/estudiantes.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-new-pago',
  standalone: false,
  templateUrl: './new-pago.html',
  styleUrl: './new-pago.css',
})
export class NewPago implements OnInit {
  pagoFormGroup!: FormGroup;
  codigoEstudiante!: string;
  tiposPagos: string[] = [];
  pdfFileUrl!: string;

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private estudiantesService: EstudiantesService,
  ) {}

  ngOnInit(): void {
    for (let elt in PaymentType) {
      let value = PaymentType[elt];
      if (typeof value === 'string') {
        this.tiposPagos.push(value);
      }
    }
    this.codigoEstudiante = this.activatedRoute.snapshot.params['codigoEstudiante'];
    this.pagoFormGroup = this.fb.group({
      date: this.fb.control(''),
      cantidad: this.fb.control(''),
      type: this.fb.control(''),
      codigoEstudiante: this.fb.control(this.codigoEstudiante),
      fileSource: this.fb.control(''),
      fileName: this.fb.control(''),
    });
  }
  selectFile(event: any) {
    if (event.target.files.length > 0) {
      let file = event.target.files[0];
      this.pagoFormGroup.patchValue({
        fileSource: file,
        fileName: file.name,
      });
      this.pdfFileUrl = window.URL.createObjectURL(file);
      console.log(this.pdfFileUrl);
    }
  }

  guardarPago() {
    let date: Date = new Date(this.pagoFormGroup.value.date);
    let formattedDate = date.toISOString().split('T')[0];

    let formData = new FormData();
    formData.set('date', formattedDate);
    formData.set('cantidad', this.pagoFormGroup.value.cantidad);
    formData.set('type', this.pagoFormGroup.value.type);
    formData.set('codigoEstudiante', this.pagoFormGroup.value.codigoEstudiante);
    formData.set('file', this.pagoFormGroup.value.fileSource);
    this.estudiantesService.guardarPago(formData).subscribe({
      next: (value) => {
        Swal.fire({
          title: 'Pago Guardado',
          text: 'El pago ha sido guardado exitosamente',
          icon: 'success',
        });
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ha ocurrido un error al guardar el pago',
        });
      },
    });
  }
}
