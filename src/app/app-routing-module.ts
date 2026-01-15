import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Login } from './login/login';
import { LoadEstudiantes } from './load-estudiantes/load-estudiantes';
import { LoadPagos } from './load-pagos/load-pagos';
import { Dashboard } from './dashboard/dashboard';
import { Estudiantes } from './estudiantes/estudiantes';
import { Pagos } from './pagos/pagos';

import { AdminTemplateComponent } from './admin-template-component/admin-template-component';
import { AuthGuard } from './guards/auth-guard';
import { AuthorizationGuard } from './guards/authorization.guards';
import { EstudianteDetails } from './estudiante-details/estudiante-details';
import { NewPago } from './new-pago/new-pago';
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


      {
        path: 'loadEstudiantes',
        component: LoadEstudiantes,
        canActivate: [AuthorizationGuard],
        data: { roles: ['ADMIN'] },
      },
      {
        path: 'loadPagos',
        component: LoadPagos,
        canActivate: [AuthorizationGuard],
        data: { roles: ['ADMIN'] },
      },
      { path: 'dashboard', component: Dashboard },
      { path: 'estudiantes', component: Estudiantes },
      { path: 'pagos', component: Pagos },
      { path: 'estudiante-detalles/:codigo', component: EstudianteDetails },
      { path: 'new-pago/:codigoEstudiante', component: NewPago },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
