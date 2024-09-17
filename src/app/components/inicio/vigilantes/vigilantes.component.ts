import { Component } from '@angular/core';

@Component({
  selector: 'app-vigilantes',
  templateUrl: './vigilantes.component.html',
  styleUrls: ['./vigilantes.component.css'],
})
export class VigilantesComponent {
  links = [
    {
      titulo: 'Registrar Vigilante',
      ruta: '/vigilante',
      icono: 'fa-solid fa-user-pen fa-8x p-4 text-center color-icon color-icon',
      info: 'Registro y actualización de los vigilantes que conforman el equipo de seguirdad de la institución.',
    },
    {
      titulo: 'Asignar Vigilante a Puesto',
      ruta: '/asignacion',
      icono: 'fa-solid fa-user-shield fa-8x p-4 text-center color-icon',
      info: 'Registrar y actualizar los vigilantes que van a pertenecer a cada uno de los puestos de control de acceso de la institución.',
    },
    {
      titulo: 'Inicio',
      ruta: '/inicio',
      icono: 'fa-solid fa-house fa-8x p-4 text-center color-icon',
      info: 'Volver al menú inicial.',
    },
  ];
}
