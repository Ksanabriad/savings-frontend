import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
            username: ['', [Validators.required, Validators.minLength(3)]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
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
                    this.router.navigate(['/admin/usuarios']);
                },
                error: (err) => {
                    console.error(err);
                    Swal.fire('Error', err.error || 'No se pudo guardar el usuario', 'error');
                }
            });
        }
    }

    cancelar() {
        this.router.navigate(['/admin/usuarios']);
    }
}
