import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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

    constructor(
        private fb: FormBuilder,
        private usuariosService: UsuariosService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.usuarioForm = this.fb.group({
            username: ['', [Validators.required, Validators.minLength(3)]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            rol: ['USER', Validators.required]
        });
    }

    save() {
        if (this.usuarioForm.valid) {
            this.usuariosService.register(this.usuarioForm.value).subscribe({
                next: () => {
                    Swal.fire('Guardado', 'El usuario ha sido creado correctamente', 'success');
                    this.router.navigate(['/admin/usuarios']);
                },
                error: (err) => {
                    console.error(err);
                    Swal.fire('Error', err.error || 'No se pudo crear el usuario', 'error');
                }
            });
        }
    }

    cancelar() {
        this.router.navigate(['/admin/usuarios']);
    }
}
