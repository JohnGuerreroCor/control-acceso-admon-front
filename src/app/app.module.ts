import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgxPrintModule } from 'ngx-print';
import { QRCodeModule } from 'angularx-qrcode';
import { MaterialModules } from './material.modules';

//INICIO INTEGRACION FIREBASE PARA IMAGENES LINEALES EMAIL - REMPLAZO DE DATA URI BASE64

import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFireAuthGuardModule } from '@angular/fire/compat/auth-guard';

//FIN INTEGRACION FIREBASE PARA IMAGENES LINEALES EMAIL - REMPLAZO DE DATA URI BASE64

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
import {
  TiqueteInvitadosComponent,
  ModalTiqueteInvitado,
} from './components/tiquete/tiquete-invitados/tiquete-invitados.component';
import {
  TiqueteVisitantesComponent,
  ModalTiqueteVisitante,
} from './components/tiquete/tiquete-visitantes/tiquete-visitantes.component';
import { ReportesComponent } from './components/reportes/reportes.component';
import {
  VigilanteComponent,
  ModalInformacionVigilante,
} from './components/vigilantes/vigilante/vigilante.component';
import {
  AsignacionComponent,
  ModalInformacionAsignacion,
} from './components/vigilantes/asignacion/asignacion.component';
import {
  PuestoVigilanciaComponent,
  ModalInformacionPuesto,
} from './components/puestos/puesto-vigilancia/puesto-vigilancia.component';
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
    MaterialModules,
    //INICIO FIREBASE
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularFireAuthGuardModule,
    //FIN FIREBASE
  ],
  entryComponents: [
    ModalTiqueteInvitado,
    ModalTiqueteVisitante,
    ModalInformacionAsignacion,
    ModalInformacionPuesto,
    ModalInformacionVigilante,
    /* ModalInformacion,
     */
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
