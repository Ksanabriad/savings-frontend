import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { AdminTemplateComponent } from './admin-template-component/admin-template-component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { Home } from './home/home';
import { Profile } from './profile/profile';
import { LoadEstudiantes } from './load-estudiantes/load-estudiantes';
import { LoadPagos } from './load-pagos/load-pagos';
import { Login } from './login/login';
import { Pagos } from './pagos/pagos';
import { Estudiantes } from './estudiantes/estudiantes';
import { Dashboard } from './dashboard/dashboard';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthGuard } from './guards/auth-guard';
import { AuthorizationGuard } from './guards/authorization.guards';
import { MatTableModule } from '@angular/material/table';
import { HttpClientModule } from '@angular/common/http';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { CdkColumnDef } from '@angular/cdk/table';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { getSpanishPaginatorIntl } from './utils/spanish-paginator-intl';
import { EstudianteDetails } from './estudiante-details/estudiante-details';
import { NewPago } from './new-pago/new-pago';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { Landing } from './landing/landing';

@NgModule({
  declarations: [
    App,
    AdminTemplateComponent,
    Home,
    Profile,
    LoadEstudiantes,
    LoadPagos,
    Login,
    Pagos,
    Estudiantes,
    Dashboard,
    EstudianteDetails,
    NewPago,
    Landing,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatSidenavModule,
    MatListModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    CdkColumnDef,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideClientHydration(withEventReplay()),
    AuthGuard,
    AuthorizationGuard,
    { provide: MatPaginatorIntl, useValue: getSpanishPaginatorIntl() },
  ],
  bootstrap: [App],
})
export class AppModule { }
