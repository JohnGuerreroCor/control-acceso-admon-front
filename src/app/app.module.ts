import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgxPrintModule } from 'ngx-print';
import { QRCodeModule } from 'angularx-qrcode';

//INICIO INTEGRACION FIREBASE PARA IMAGENES LINEALES EMAIL - REMPLAZO DE DATA URI BASE64

import { environment } from "../environments/environment";
import { AngularFireModule } from '@angular/fire/compat'
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFireAuthModule } from "@angular/fire/compat/auth";
import { AngularFireStorageModule } from "@angular/fire/compat/storage";
import { AngularFireAuthGuardModule } from "@angular/fire/compat/auth-guard";

//FIN INTEGRACION FIREBASE PARA IMAGENES LINEALES EMAIL - REMPLAZO DE DATA URI BASE64

//INICIO ANGULAR MATERIAL
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTreeModule } from '@angular/material/tree';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import { MatRadioModule } from '@angular/material/radio';
//FIN ANGULAR MATERIAL

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TokenComponent } from './components/token/token.component';
import { LoginComponent } from './components/login/login.component';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { VigilantesComponent } from './components/inicio/vigilantes/vigilantes.component';
import { TiquetesComponent } from './components/inicio/tiquetes/tiquetes.component';
import { PuestosComponent } from './components/inicio/puestos/puestos.component';
import { TiqueteEventosComponent } from './components/tiquete/tiquete-eventos/tiquete-eventos.component';
import { TiqueteInvitadosComponent, ModalTiqueteInvitado  } from './components/tiquete/tiquete-invitados/tiquete-invitados.component';
import { TiqueteVisitantesComponent, ModalTiqueteVisitante  } from './components/tiquete/tiquete-visitantes/tiquete-visitantes.component';
import { ReportesComponent } from './components/reportes/reportes.component';
import { VigilanteComponent, ModalInformacionVigilante } from './components/vigilantes/vigilante/vigilante.component';
import { AsignacionComponent, ModalInformacionAsignacion  } from './components/vigilantes/asignacion/asignacion.component';
import { PuestoVigilanciaComponent, ModalInformacionPuesto } from './components/puestos/puesto-vigilancia/puesto-vigilancia.component';
import { HorarioComponent } from './components/puestos/horario/horario.component';

@NgModule({
  declarations: [
    AppComponent,
    TokenComponent,
    LoginComponent,
    NavbarComponent,
    InicioComponent,
    VigilantesComponent,
    TiquetesComponent,
    PuestosComponent,
    TiqueteEventosComponent,
    TiqueteInvitadosComponent,
    TiqueteVisitantesComponent,
    ModalTiqueteInvitado,
    ModalTiqueteVisitante,
    ModalInformacionAsignacion,
    ModalInformacionVigilante,
    ModalInformacionPuesto,
    ReportesComponent,
    VigilanteComponent,
    AsignacionComponent,
    PuestoVigilanciaComponent,
    HorarioComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxPrintModule,
    QRCodeModule,

    //INICIO FIREBASE
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularFireAuthGuardModule,
    //FIN FIREBASE

    //INICIO ANGULAR MATERIAL
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatTabsModule,
    MatSelectModule,
    MatPaginatorModule,
    MatRadioModule,
    MatCardModule,
    MatDialogModule,
    MatGridListModule,
    MatNativeDateModule,
    MatTableModule,
    MatExpansionModule,
    MatTreeModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    //FIN ANGULAR MAERIAL


  ],
  entryComponents: [
    ModalTiqueteInvitado,
    ModalTiqueteVisitante,
    ModalInformacionAsignacion,
    ModalInformacionPuesto,
    ModalInformacionVigilante
    /* ModalInformacion,
     */
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
