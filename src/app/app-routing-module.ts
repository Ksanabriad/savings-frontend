import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Login } from './login/login';
import { Dashboard } from './dashboard/dashboard';
import { Estudiantes } from './estudiantes/estudiantes';
import { Finanzas } from './finanzas/finanzas';
import { AdminTemplateComponent } from './admin-template-component/admin-template-component';
import { AuthGuard } from './guards/auth-guard';
import { AuthorizationGuard } from './guards/authorization.guards';
import { EstudianteDetails } from './estudiante-details/estudiante-details';
import { NewFinanza } from './new-finanza/new-finanza';
import { Conceptos } from './conceptos/conceptos';
import { Landing } from './landing/landing';
import { Register } from './register/register';

const routes: Routes = [
  { path: '', component: Landing }, // ← RAÍZ → /landing
  { path: 'login', component: Login }, // ← LOGIN
  { path: 'register', component: Register },
  {
    path: 'admin',
    component: AdminTemplateComponent, // ← Layout principal
    canActivate: [AuthGuard],
    children: [


      { path: 'dashboard', component: Dashboard },
      { path: 'estudiantes', component: Estudiantes },
      { path: 'finanzas', component: Finanzas },
      { path: 'conceptos', component: Conceptos },
      { path: 'estudiante-detalles/:codigo', component: EstudianteDetails },
      { path: 'nueva-finanza', component: NewFinanza },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
