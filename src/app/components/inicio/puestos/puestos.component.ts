import { Component } from '@angular/core';

@Component({
  selector: 'app-puestos',
  templateUrl: './puestos.component.html',
  styleUrls: ['./puestos.component.css'],
})
export class PuestosComponent {
  links = [
    {
      titulo: 'Puesto',
      ruta: '/puesto',
      icono:
        'fa-solid fa-location-pin fa-8x p-4 text-center color-icon color-icon',
      info: 'Registro y actualización de puestos de vigilancia por cada uno de los tipos: peatonal y vehicular.',
    },
    {
      titulo: 'Horarios',
      ruta: '/horarios',
      icono: 'fa-solid fa-clock fa-8x p-4 text-center color-icon',
      info: 'Registro y actualización de horarios por cada puesto de vigilancia que posee la institución.',
    },
    {
      titulo: 'Inicio',
      ruta: '/inicio',
      icono: 'fa-solid fa-house fa-8x p-4 text-center color-icon',
      info: 'Volver al menú inicial.',
    },
  ];
}
