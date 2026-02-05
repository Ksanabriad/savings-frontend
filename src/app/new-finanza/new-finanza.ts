import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
    isEditMode: boolean = false;
    finanzaId!: number;
    tiposFinanza: any[] = [];
    mediosPago: any[] = [];
    conceptos: any[] = [];
    pdfFileUrl!: string;

    maxDate: Date = new Date();

    constructor(
        private fb: FormBuilder,
        private finanzasService: FinanzasService,
        public auth: Auth,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.loadInitialData();
        this.initForm();
        this.checkEditMode();
    }

    private loadInitialData() {
        this.finanzasService.getConceptos().subscribe({
            next: (data) => this.conceptos = data,
            error: (err) => console.error(err)
        });
        this.finanzasService.getTipos().subscribe(data => this.tiposFinanza = data);
        this.finanzasService.getMedios().subscribe(data => this.mediosPago = data);
    }

    private initForm() {
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

    private checkEditMode() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.isEditMode = true;
            this.finanzaId = +id;
            this.loadFinanzaData(this.finanzaId);
        }
    }

    private loadFinanzaData(id: number) {
        this.finanzasService.getFinanza(id).subscribe({
            next: (finanza) => {
                // Mapear los datos al formulario
                this.finanzaFormGroup.patchValue({
                    fecha: new Date(finanza.fecha + 'T00:00:00'),
                    concepto: finanza.concepto?.nombre || '',
                    cantidad: finanza.cantidad,
                    tipo: finanza.tipo?.nombre || '',
                    medio: finanza.medio?.nombre || '',
                    fileName: finanza.file ? 'Archivo guardado' : ''
                });
            },
            error: (err) => {
                console.error('Error cargando finanza:', err);
                Swal.fire('Error', 'No se pudo cargar el registro para editar', 'error');
            }
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
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        let formattedDate = `${year}-${month}-${day}`;

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

        const request = this.isEditMode
            ? this.finanzasService.actualizarFinanza(this.finanzaId, formData)
            : this.finanzasService.guardarFinanza(formData);

        const successMessage = this.isEditMode ? 'Finanza Actualizada' : 'Finanza Guardada';
        const successText = this.isEditMode
            ? 'El registro financiero ha sido actualizado exitosamente'
            : 'El registro financiero ha sido guardado exitosamente';

        request.subscribe({
            next: () => {
                Swal.fire({
                    title: successMessage,
                    text: successText,
                    icon: 'success',
                }).then(() => {
                    this.router.navigateByUrl(`/${username}/finanzas`);
                });
            },
            error: (err) => {
                console.error(err);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: `Ha ocurrido un error al ${this.isEditMode ? 'actualizar' : 'guardar'} el registro`,
                });
            },
        });
    }
    goBack() {
        const username = this.auth.getUsername();
        if (username) {
            this.router.navigate([`/${username}/finanzas`]);
        }
    }
}
