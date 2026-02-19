import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { UsuariosService } from '../services/usuarios.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-new-usuario',
    standalone: false,
    templateUrl: './new-usuario.html',
    styleUrls: ['./new-usuario.css']
})
export class NewUsuario implements OnInit {
    usuarioForm!: FormGroup;
    isEditMode: boolean = false;
    usuarioId!: string;

    constructor(
        private fb: FormBuilder,
        private usuariosService: UsuariosService,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.usuarioForm = this.fb.group({
            username: ['', [
                Validators.required,
                RxwebValidators.minLength({ value: 4 }),
                RxwebValidators.maxLength({ value: 20 }),
                RxwebValidators.pattern({ expression: { 'alphaNumeric': /^[a-zA-Z0-9]+$/ } })
            ]],
            email: ['', [
                Validators.required,
                RxwebValidators.email()
            ]],
            password: ['', [
                Validators.required,
                RxwebValidators.password({
                    validation: {
                        minLength: 6,
                        maxLength: 12,
                        digit: true,
                        lowerCase: true,
                        upperCase: true
                    }
                })
            ]],
            perfil: this.fb.group({
                nombre: ['USER', Validators.required]
            })
        });

        // Check if we're in edit mode
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.isEditMode = true;
            this.usuarioId = id;
            this.loadUsuarioData(this.usuarioId);
            // Make password optional when editing
            this.usuarioForm.get('password')?.clearValidators();
            this.usuarioForm.get('password')?.updateValueAndValidity();
        }
    }

    private loadUsuarioData(id: string) {
        this.usuariosService.getUsuario(id).subscribe({
            next: (usuario) => {
                this.usuarioForm.patchValue({
                    username: usuario.username,
                    email: usuario.email,
                    perfil: {
                        nombre: usuario.perfil?.nombre || 'USER'
                    }
                });
            },
            error: (err) => {
                console.error('Error cargando usuario:', err);
                Swal.fire('Error', 'No se pudo cargar el usuario para editar', 'error');
            }
        });
    }

    save() {
        if (this.usuarioForm.valid) {
            const request = this.isEditMode
                ? this.usuariosService.updateUsuario(this.usuarioId, this.usuarioForm.value)
                : this.usuariosService.register(this.usuarioForm.value);

            const successMessage = this.isEditMode ? 'Actualizado' : 'Guardado';
            const successText = this.isEditMode
                ? 'El usuario ha sido actualizado correctamente'
                : 'El usuario ha sido creado correctamente';

            request.subscribe({
                next: () => {
                    Swal.fire(successMessage, successText, 'success');
                    const username = this.usuarioForm.get('username')?.value;
                    this.router.navigateByUrl(`/${username}/usuarios`);
                },
                error: (err) => {
                    console.error(err);
                    const msg = err.error?.message || err.error || 'No se pudo guardar el usuario';
                    Swal.fire('Error', typeof msg === 'string' ? msg : JSON.stringify(msg), 'error');
                }
            });
        }
    }

    cancelar() {
        this.router.navigate(['/admin/usuarios']);
    }
}
