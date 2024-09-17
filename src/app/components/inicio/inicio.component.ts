import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';
import { UbicacionService } from '../../services/ubicacion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
})
export class InicioComponent implements OnInit {
  links = [
    {
      titulo: 'Puesto Vigilancia',
      ruta: '/puestos',
      icono:
        'fa-solid fa-tower-observation fa-8x p-4 text-center color-icon color-icon',
      info: 'Este módulo se encarga de establecer los horarios de venta y atención en el restaurante, garantizando una gestión eficiente del tiempo.',
    },
    {
      titulo: 'Vigilantes',
      ruta: '/vigilantes',
      icono: 'fa-solid fa-user-shield fa-8x p-4 text-center color-icon',
      info: 'Actualmente en construcción, este módulo en el futuro será responsable de llevar un registro histórico de las ventas y consumos para un determinado día.',
    },
    {
      titulo: 'Tiquetes',
      ruta: '/tiquetes',
      icono: 'fa-solid fa-ticket fa-8x p-4 text-center color-icon',
      info: 'Módulo dedicado a la parametrización contractual, gestionando contratos vigentes, pasados y futuros.',
    },
    {
      titulo: 'Reportes',
      ruta: '/reportes',
      icono: 'fa-solid fa-chart-simple fa-8x p-4 text-center color-icon',
      info: 'Módulo destinado a proporcionar beneficios restaurantiles a poblaciones vulnerables y casos especiales, promoviendo la responsabilidad social.',
    },
  ];
  anio!: number;
  fecha = new Date();
  url: string = environment.URL_BACKEND;

  constructor(
    public auth: AuthService,
    private router: Router,
    public ubicacionService: UbicacionService
  ) {}

  ngOnInit() {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/login']);
    } else {
      this.obtenerSedes();
    }
    this.anio = this.fecha.getUTCFullYear();
  }

  obtenerSedes() {
    this.ubicacionService.obtenerSedes().subscribe();
  }

  mensajeError() {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Ocurrio Un Error!',
    });
  }

  mensajeSuccses() {
    Swal.fire({
      icon: 'success',
      title: 'Proceso Realizado',
      showConfirmButton: false,
      timer: 1500,
    });
  }

  fError(er: any): void {
    let err = er.error.error_description;
    let arr: string[] = err.split(':');

    if (arr[0] == 'Access token expired') {
      this.auth.logout();
      this.router.navigate(['login']);
    } else {
      this.mensajeError();
    }
  }
}
