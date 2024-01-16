import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { TokenComponent } from './components/token/token.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { PuestosComponent } from './components/inicio/puestos/puestos.component';
import { TiquetesComponent } from './components/inicio/tiquetes/tiquetes.component';
import { VigilantesComponent } from './components/inicio/vigilantes/vigilantes.component';
import { TiqueteInvitadosComponent } from './components/tiquete/tiquete-invitados/tiquete-invitados.component';
import { TiqueteVisitantesComponent } from './components/tiquete/tiquete-visitantes/tiquete-visitantes.component';
import { TiqueteEventosComponent } from './components/tiquete/tiquete-eventos/tiquete-eventos.component';
import { ReportesComponent } from './components/reportes/reportes.component';
import { VigilanteComponent } from './components/vigilantes/vigilante/vigilante.component';
import { AsignacionComponent } from './components/vigilantes/asignacion/asignacion.component';
import { PuestoVigilanciaComponent } from './components/puestos/puesto-vigilancia/puesto-vigilancia.component';
import { HorarioComponent } from './components/puestos/horario/horario.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'token', component: TokenComponent },
  
  { path: 'inicio', component: InicioComponent },

  { path: 'puestos', component: PuestosComponent },
  { path: 'puesto', component: PuestoVigilanciaComponent },
  { path: 'horarios', component: HorarioComponent },

  { path: 'vigilantes', component: VigilantesComponent },
  { path: 'vigilante', component: VigilanteComponent },
  { path: 'asignacion', component: AsignacionComponent },

  { path: 'tiquetes', component: TiquetesComponent },
  { path: 'tiquete-invitados', component: TiqueteInvitadosComponent },
  { path: 'tiquete-visitantes', component: TiqueteVisitantesComponent },
  { path: 'tiquete-eventos', component: TiqueteEventosComponent },

  { path: 'reportes', component: ReportesComponent },


  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', pathMatch: 'full', redirectTo: '/login' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
