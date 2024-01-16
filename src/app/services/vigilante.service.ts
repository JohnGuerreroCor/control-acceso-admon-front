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
import { Vigilante } from '../models/vigilante';

@Injectable({
  providedIn: 'root',
})
export class VigilanteService {
  private url: string = `${environment.URL_BACKEND}/vigilante`;
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

  obtenerVigilantes(): Observable<Vigilante[]> {
    return this.http
      .get<Vigilante[]>(`${this.url}/obtener-vigilantes/${this.userLogeado}`, {
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

  obtenerVigilantesActivos(): Observable<Vigilante[]> {
    return this.http
      .get<Vigilante[]>(
        `${this.url}/obtener-vigilantes-activos/${this.userLogeado}`,
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

  obtenerVigilantesSinAsignacion(): Observable<Vigilante[]> {
    return this.http
      .get<Vigilante[]>(
        `${this.url}/obtener-vigilantes-sin-asignacion/${this.userLogeado}`,
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

  obtenerVigilanteIdentificacion(id: String): Observable<Vigilante[]> {
    return this.http
      .get<Vigilante[]>(
        `${this.url}/obtener-vigilantes-identificacion/${id}/${this.userLogeado}`,
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

  obtenerVigilanteCodigo(codigo: number): Observable<Vigilante[]> {
    return this.http
      .get<Vigilante[]>(
        `${this.url}/obtener-vigilante-codigo/${codigo}/${this.userLogeado}`,
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

  registrarVigilante(vigilante: Vigilante): Observable<number> {
    return this.http.post<number>(
      `${this.url}/registrar-vigilante/${this.userLogeado}`,
      vigilante,
      { headers: this.aggAutorizacionHeader() }
    );
  }

  actualizarVigilante(vigilante: Vigilante): Observable<number> {
    return this.http.put<number>(
      `${this.url}/actualizar-vigilante/${this.userLogeado}`,
      vigilante,
      { headers: this.aggAutorizacionHeader() }
    );
  }
}
