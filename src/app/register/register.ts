import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
    selector: 'app-register',
    standalone: false,
    templateUrl: './register.html',
    styleUrls: ['./register.css'],
})
export class Register implements OnInit {
    public registerForm!: FormGroup;

    constructor(private formBuilder: FormBuilder, private router: Router) { }

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
        if (this.registerForm.valid) {
            // Logic to save the user would go here
            console.log('User registered:', this.registerForm.value);
            // For now, redirect to login
            this.router.navigate(['/login']);
        } else {
            console.log('Form is invalid');
            this.registerForm.markAllAsTouched();
        }
    }

    goBack() {
        this.router.navigate(['/login']);
    }
}
