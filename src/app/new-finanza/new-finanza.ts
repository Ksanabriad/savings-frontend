import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TipoFinanza, MedioPago } from '../models/estudiantes.model';
import { FinanzasService } from '../services/finanzas.service';
import { Auth } from '../services/auth';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-new-finanza',
    standalone: false,
    templateUrl: './new-finanza.html',
    styleUrl: './new-finanza.css',
})
export class NewFinanza implements OnInit {
    finanzaFormGroup!: FormGroup;
    tiposFinanza = Object.values(TipoFinanza);
    mediosPago = Object.values(MedioPago);
    conceptos: any[] = [];
    pdfFileUrl!: string;

    constructor(
        private fb: FormBuilder,
        private finanzasService: FinanzasService,
        private auth: Auth,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.finanzasService.getConceptos().subscribe({
            next: (data) => this.conceptos = data,
            error: (err) => console.error(err)
        });
        this.finanzaFormGroup = this.fb.group({
            fecha: [new Date(), Validators.required],
            concepto: ['', Validators.required],
            cantidad: ['', [Validators.required, Validators.min(1)]],
            tipo: ['', Validators.required],
            medio: ['', Validators.required],
            fileSource: [''],
            fileName: [''],
        });
    }

    selectFile(event: any) {
        if (event.target.files.length > 0) {
            let file = event.target.files[0];
            this.finanzaFormGroup.patchValue({
                fileSource: file,
                fileName: file.name,
            });
            this.pdfFileUrl = window.URL.createObjectURL(file);
        }
    }

    guardarFinanza() {
        if (this.finanzaFormGroup.invalid) return;

        const username = this.auth.getUsername();
        if (!username) return;

        let date: Date = new Date(this.finanzaFormGroup.value.fecha);
        let formattedDate = date.toISOString().split('T')[0];

        let formData = new FormData();
        formData.set('fecha', formattedDate);
        formData.set('concepto', this.finanzaFormGroup.value.concepto);
        formData.set('cantidad', this.finanzaFormGroup.value.cantidad);
        formData.set('tipo', this.finanzaFormGroup.value.tipo);
        formData.set('medio', this.finanzaFormGroup.value.medio);
        formData.set('username', username);
        if (this.finanzaFormGroup.value.fileSource) {
            formData.set('file', this.finanzaFormGroup.value.fileSource);
        }

        this.finanzasService.guardarFinanza(formData).subscribe({
            next: () => {
                Swal.fire({
                    title: 'Finanza Guardada',
                    text: 'El registro financiero ha sido guardado exitosamente',
                    icon: 'success',
                }).then(() => {
                    this.router.navigateByUrl('/admin/finanzas');
                });
            },
            error: (err) => {
                console.error(err);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Ha ocurrido un error al guardar el registro',
                });
            },
        });
    }
}
