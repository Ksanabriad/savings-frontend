import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { UsuariosService } from '../services/usuarios.service';
import { Usuario } from '../models/usuarios.model';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-register',
    standalone: false,
    templateUrl: './register.html',
    styleUrls: ['./register.css'],
})
export class Register implements OnInit {
    public registerForm!: FormGroup;
    public errorMessage: string | null = null;
    public emailError: string | null = null;
    public usernameError: string | null = null;
    public submitted = false;

    constructor(private formBuilder: FormBuilder, private router: Router, private apiService: UsuariosService) { }

    ngOnInit(): void {
        this.registerForm = this.formBuilder.group({
            email: ['', [
                Validators.required,
                RxwebValidators.email()
            ]],
            username: ['', [
                Validators.required,
                RxwebValidators.minLength({ value: 4 }),
                RxwebValidators.maxLength({ value: 20 }),
                RxwebValidators.pattern({ expression: { 'alphaNumeric': /^[a-zA-Z0-9]+$/ } })
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
            confirmPassword: ['', [
                Validators.required,
                RxwebValidators.compare({ fieldName: 'password' })
            ]]
        });
    }

    save() {
        this.submitted = true;
        this.registerForm.markAllAsTouched();

        if (this.registerForm.valid) {
            this.apiService.register(this.registerForm.value).subscribe({
                next: (user: Usuario) => {
                    Swal.fire({
                        title: 'Usuario registrado',
                        text: 'Usuario registrado con éxito',
                        icon: 'success',
                    });
                    this.router.navigate(['/login']);
                },
                error: (err: any) => {
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
