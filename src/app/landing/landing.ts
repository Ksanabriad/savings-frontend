import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-landing',
    templateUrl: './landing.html',
    styleUrls: ['./landing.css'],
    standalone: false,
})
export class Landing {
    constructor(private router: Router) { }

    goToLogin() {
        this.router.navigate(['/login']);
    }
}
