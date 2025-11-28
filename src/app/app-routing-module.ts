import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from './home/home';
import { Login } from './login/login';
import { LoadEstudiantes } from './load-estudiantes/load-estudiantes';
import { LoadPagos } from './load-pagos/load-pagos';
import { Dashboard } from './dashboard/dashboard';
import { Estudiantes } from './estudiantes/estudiantes';
import { Pagos } from './pagos/pagos';
import { Profile } from './profile/profile';
import { AdminTemplateComponent } from './admin-template-component/admin-template-component';


const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },  // ← RAÍZ → /login
  { path: 'login', component: Login },                    // ← LOGIN
  {
    path: 'admin', component: AdminTemplateComponent, // ← Layout principal
    children: [
      { path: "home", component: Home },
      { path: "profile", component: Profile },
      { path: "loadEstudiantes", component: LoadEstudiantes },
      { path: "loadPagos", component: LoadPagos },
      { path: "dashboard", component: Dashboard },
      { path: "estudiantes", component: Estudiantes },
      { path: "pagos", component: Pagos }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
