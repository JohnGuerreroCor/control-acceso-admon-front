import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tiquetes',
  templateUrl: './tiquetes.component.html',
  styleUrls: ['./tiquetes.component.css'],
})
export class TiquetesComponent implements OnInit {
  links = [
    {
      titulo: 'Invitados',
      ruta: '/tiquete-invitados',
      icono:
        'fa-solid fa-users-rectangle fa-8x p-4 text-center color-icon color-icon',
      info: 'Registro, actualización de correo, generación de tiquete de acceso, asignación de foto y parametrización con fecha de ingreso y salida de los invitados que tenga la institución.',
    },
    {
      titulo: 'Visitantes',
      ruta: '/tiquete-visitantes',
      icono: 'fa-solid fa-users fa-8x p-4 text-center color-icon',
      info: 'Registro, actualización de correo, generación de tiquete decacceso con una vigencia de 24 horas.',
    },
    {
      titulo: 'Eventos',
      ruta: '/tiquete-eventos',
      icono: 'fa-solid fa-people-group fa-8x p-4 text-center color-icon',
      info: 'Registro y generación masiva de tiquetes de acceso con una vigencia de 24 horas para eventos Institucionales.',
    },
    {
      titulo: 'Inicio',
      ruta: '/inicio',
      icono: 'fa-solid fa-house fa-8x p-4 text-center color-icon',
      info: 'Volver al menú inicial.',
    },
  ];

  constructor() {}

  ngOnInit() {}
}
