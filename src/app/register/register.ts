import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuariosService } from '../services/usuarios.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-register',
    standalone: false,
    templateUrl: './register.html',
    styleUrls: ['./register.css'],
})
export class Register implements OnInit {
    public registerForm!: FormGroup;
    // ... existing properties ...
    public errorMessage: string | null = null;
    public emailError: string | null = null;
    public usernameError: string | null = null;
    public submitted = false;

    constructor(private formBuilder: FormBuilder, private router: Router, private apiService: UsuariosService) { }

    ngOnInit(): void {
        this.registerForm = this.formBuilder.group(
            {
                email: ['', [Validators.required, Validators.email]],
                username: ['', Validators.required],
                password: ['', Validators.required],
                confirmPassword: ['', Validators.required],
            },
            { validators: this.passwordMatchValidator }
        );
    }

    passwordMatchValidator(form: FormGroup) {
        const password = form.get('password')?.value;
        const confirmPassword = form.get('confirmPassword')?.value;
        return password === confirmPassword ? null : { mismatch: true };
    }

    save() {
        this.submitted = true;
        this.registerForm.markAllAsTouched();

        if (this.registerForm.valid) {
            this.apiService.register(this.registerForm.value).subscribe({
                next: (user) => {
                    Swal.fire({
                        title: 'Usuario registrado',
                        text: 'Usuario registrado con éxito',
                        icon: 'success',
                    });
                    this.router.navigate(['/login']);
                },
                error: (err) => {
                    console.error('Error registering user', err);
                    const errorMsg = err.error?.toLowerCase() || '';

                    if (errorMsg.includes('email')) {
                        this.registerForm.get('email')?.setErrors({ backendError: err.error });
                    } else if (errorMsg.includes('usuario') || errorMsg.includes('username')) {
                        this.registerForm.get('username')?.setErrors({ backendError: err.error });
                    } else {
                        this.errorMessage = err.error || 'Error al registrar usuario.';
                    }
                }
            });
        }
    }

    goBack() {
        this.router.navigate(['/login']);
    }
}
