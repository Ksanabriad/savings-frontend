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


import { Login } from './login/login';
import { Finanzas } from './finanzas/finanzas';
import { Usuarios } from './usuarios/usuarios';
import { Dashboard } from './dashboard/dashboard';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthGuard } from './guards/auth-guard';
import { AuthorizationGuard } from './guards/authorization.guards';
import { MatTableModule } from '@angular/material/table';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { CdkColumnDef } from '@angular/cdk/table';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { getSpanishPaginatorIntl } from './utils/spanish-paginator-intl';
import { NewFinanza } from './new-finanza/new-finanza';
import { Conceptos } from './conceptos/conceptos';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Landing } from './landing/landing';
import { Register } from './register/register';
import { NewUsuario } from './new-usuario/new-usuario';
import { HistorialInformes } from './historial-informes/historial-informes';

@NgModule({
  declarations: [
    App,
    AdminTemplateComponent,
    Login,
    Finanzas,
    Usuarios,
    NewFinanza,
    Conceptos,
    Landing,
    Register,
    NewUsuario,
    HistorialInformes,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    Dashboard,
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
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    CdkColumnDef,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideClientHydration(withEventReplay()),
    AuthGuard,
    AuthorizationGuard,
    { provide: MatPaginatorIntl, useValue: getSpanishPaginatorIntl() },
    provideHttpClient(withFetch()),
  ],
  bootstrap: [App],
})
export class AppModule { }
