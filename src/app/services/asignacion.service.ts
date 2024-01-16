import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { Oficina } from '../models/oficina';
import { PuestoTipo } from '../models/puesto-tipo';
import swal from 'sweetalert2';
import { Dia } from '../models/dia';
import { Hora } from '../models/hora';
import { Asignacion } from '../models/asignacion';
import { Asignado } from '../models/asignado';

@Injectable({
  providedIn: 'root',
})
export class AsignacionService {
  private url: string = `${environment.URL_BACKEND}/asignacion`;
  private httpHeaders = new HttpHeaders({ 'Content-type': 'application/json' });

  userLogeado: String = this.authservice.user.username;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authservice: AuthService
  ) {}

  private aggAutorizacionHeader(): HttpHeaders {
    let token = this.authservice.Token;
    if (token != null) {
      return this.httpHeaders.append('Authorization', 'Bearer ' + token);
    }
    return this.httpHeaders;
  }

  private isNoAutorizado(e: any): boolean {
    if (e.status == 401 || e.status == 403) {
      if (this.authservice.isAuthenticated()) {
        this.authservice.logout();
      }
      this.router.navigate(['login']);
      return true;
    }
    return false;
  }

  obtenerAsignaciones(): Observable<Asignacion[]> {
    return this.http
      .get<Asignacion[]>(
        `${this.url}/obtener-asignaciones/${this.userLogeado}`,
        { headers: this.aggAutorizacionHeader() }
      )
      .pipe(
        catchError((e) => {
          if (this.isNoAutorizado(e)) {
            return throwError(e);
          }
          return throwError(e);
        })
      );
  }

  obtenerAsignacionesActivas(): Observable<Asignacion[]> {
    return this.http
      .get<Asignacion[]>(
        `${this.url}/obtener-asignaciones-activos/${this.userLogeado}`,
        { headers: this.aggAutorizacionHeader() }
      )
      .pipe(
        catchError((e) => {
          if (this.isNoAutorizado(e)) {
            return throwError(e);
          }
          return throwError(e);
        })
      );
  }

  obtenerAsignacionesCodigo(codigo: number): Observable<Asignacion[]> {
    return this.http
      .get<Asignacion[]>(
        `${this.url}/obtener-asignacion-codigo/${codigo}/${this.userLogeado}`,
        { headers: this.aggAutorizacionHeader() }
      )
      .pipe(
        catchError((e) => {
          if (this.isNoAutorizado(e)) {
            return throwError(e);
          }
          return throwError(e);
        })
      );
  }

  obtenerAsignacionesCodigoPuesto(codigo: number): Observable<Asignacion[]> {
    return this.http
      .get<Asignacion[]>(
        `${this.url}/obtener-asignacion-codigo-puesto/${codigo}/${this.userLogeado}`,
        { headers: this.aggAutorizacionHeader() }
      )
      .pipe(
        catchError((e) => {
          if (this.isNoAutorizado(e)) {
            return throwError(e);
          }
          return throwError(e);
        })
      );
  }

  obtenerAsgignados(): Observable<Asignado[]> {
    return this.http
      .get<Asignado[]>(`${this.url}/obtener-asignados/${this.userLogeado}`, {
        headers: this.aggAutorizacionHeader(),
      })
      .pipe(
        catchError((e) => {
          if (this.isNoAutorizado(e)) {
            return throwError(e);
          }
          return throwError(e);
        })
      );
  }

  registrarAsignación(asignacion: Asignacion): Observable<number> {
    return this.http.post<number>(
      `${this.url}/registrar-asignacion/${this.userLogeado}`,
      asignacion,
      { headers: this.aggAutorizacionHeader() }
    );
  }

  actualizarAsignacion(asignacion: Asignacion): Observable<number> {
    return this.http.put<number>(
      `${this.url}/actualizar-asignacion/${this.userLogeado}`,
      asignacion,
      { headers: this.aggAutorizacionHeader() }
    );
  }
}
