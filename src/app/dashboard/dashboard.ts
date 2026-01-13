import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  currentBalance: number = 2450.75;

  constructor(private router: Router) { }

  goToEstudiantes() {
    this.router.navigate(['/admin/estudiantes']);
  }
}
