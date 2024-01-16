import { Component, OnInit, ViewChild } from '@angular/core';
import { TipoDocumentoService } from '../../../services/tipo-documento.service';
import { TipoDocumento } from '../../../models/tipo-documento';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatSelectionList } from '@angular/material/list';
import { MatPaginator } from '@angular/material/paginator';
import { Sede } from '../../../models/sede';
import { SubSede } from '../../../models/sub-sede';
import { UbicacionService } from '../../../services/ubicacion.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Bloque } from 'src/app/models/bloque';
import { PuestoVigilanciaService } from '../../../services/puesto-vigilancia.service';
import { PuestoTipo } from '../../../models/puesto-tipo';
import { PuestoVigilancia } from '../../../models/puesto-vigilancia';
import { Dia } from '../../../models/dia';
import { Hora } from '../../../models/hora';
import { HorarioService } from '../../../services/horario.service';
import { Horario } from '../../../models/horario';
import swal from 'sweetalert2';

@Component({
  selector: 'app-horario',
  templateUrl: './horario.component.html',
  styleUrls: ['./horario.component.css'],
  providers: [DatePipe],
})
export class HorarioComponent implements OnInit {
  //Arreglos
  tipoDocumentos: TipoDocumento[] = [];
  sedes: Sede[] = [];
  subsedes: SubSede[] = [];
  bloques: Bloque[] = [];
  tipoPuesto: PuestoTipo[] = [];
  puestos: PuestoVigilancia[] = [];
  puestosFiltro: PuestoVigilancia[] = [];
  dias: Dia[] = [];
  horas: Hora[] = [];
  horasCierre: Hora[] = [];
  arregloDias: any = [];
  horario: Horario[] = [];

  //Booleanos
  tipoLugar: boolean = true;
  terceroExiste!: boolean;
  ticket: boolean = false;
  botonesTickets: boolean = false;
  peatonal: boolean = false;
  vehicular: boolean = false;
  bicicletas: boolean = false;
  editar: boolean = false;
  cargando: boolean = false;
  estado!: number;

  //Complementos

  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = [
    'index',
    'sede',
    'tipo',
    'puesto',
    'dia',
    'apertura',
    'cierre',
    'opciones',
  ];
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild('allSelected', { static: false }) allSelected!: MatSelectionList;

  qrCodeTwo: any = null;
  formularioHorario!: FormGroup;
  selectDateInicio!: Date | null;
  selectDateFin!: Date | null;
  dateInicio = new FormControl(new Date());
  dateFin = new FormControl(new Date());
  myControl = new FormControl();
  oficinaCodigo!: number;

  constructor(
    private formBuilder: FormBuilder,
    public tipoDocumentoService: TipoDocumentoService,
    public ubicacionService: UbicacionService,
    public puestoVigilanciaService: PuestoVigilanciaService,
    public horarioService: HorarioService,
    private authService: AuthService,
    private router: Router,
    private datePipe: DatePipe
  ) {
    if (this.authService.validacionToken()) {
      this.qrCodeTwo = 'https://gaitana.usco.edu.co/sgd/';
      this.obtenerSede();
      this.obtenerPuestoVigilancia();
    }
  }

  ngOnInit() {
    this.crearFormularioHorario();
    this.obtenerTipoPuesto();
    this.obternerHoras();
    this.obternerDias();
    this.obtenerHorarios();
  }

  scrollToComponent(page: HTMLElement) {
    page.scrollIntoView({ behavior: 'smooth' });
  }

  obtenerHorarios() {
    this.horarioService.obtenerHorario().subscribe((data) => {
      this.dataSource = new MatTableDataSource<Horario>(data);
      this.paginator.firstPage();
      this.dataSource.paginator = this.paginator;
    });
  }

  obtenerPuestoVigilancia() {
    this.puestoVigilanciaService.obtenerPuestoVigilancia().subscribe((data) => {
      this.puestos = data;
    });
  }

  private crearFormularioHorario(): void {
    this.formularioHorario = this.formBuilder.group({
      //Vaiables Entidad Tercero
      codigo: new FormControl(''),
      sede: new FormControl('', Validators.required),
      subsede: new FormControl('', Validators.required),
      tipo: new FormControl('', Validators.required),
      puesto: new FormControl('', Validators.required),
      apertura: new FormControl('', Validators.required),
      cierre: new FormControl('', Validators.required),
      fechaCreacion: new FormControl(''),
      fechaCierre: new FormControl(''),
      dia: new FormControl('', Validators.required),
      diaAuxiliar: new FormControl(''),
      estado: new FormControl(''),
    });
  }

  generarHorario(): void {
    this.cargando = true;
    for (let index = 0; index < this.arregloDias.length; index++) {
      let horario: Horario = new Horario();
      horario.codigo = this.formularioHorario.get('codigo')!.value;
      let puesto: PuestoVigilancia = new PuestoVigilancia();
      puesto.codigo = this.formularioHorario.get('puesto')!.value;
      horario.puestoVigilancia = puesto;
      horario.horaApertura = this.formularioHorario.get('apertura')!.value;
      horario.horaCierre = this.formularioHorario.get('cierre')!.value;
      horario.fechaCreacion =
        this.formularioHorario.get('fechaCreacion')!.value;
      let dia: Dia = new Dia();
      dia.codigo = this.arregloDias[index].codigo;
      horario.dia = dia;
      horario.estado = this.formularioHorario.get('estado')!.value;

      if (this.editar) {
        this.actualizar(horario);
      } else {
        this.registrar(horario);
      }
    }
    this.mensajeExito();
    this.cargando = false;
  }

  guardarHorario(): void {
    this.cargando = true;
    let horario: Horario = new Horario();
    horario.codigo = this.formularioHorario.get('codigo')!.value;
    let puesto: PuestoVigilancia = new PuestoVigilancia();
    puesto.codigo = this.formularioHorario.get('puesto')!.value;
    horario.puestoVigilancia = puesto;
    horario.horaApertura = this.formularioHorario.get('apertura')!.value;
    horario.horaCierre = this.formularioHorario.get('cierre')!.value;
    horario.fechaCreacion = this.formularioHorario.get('fechaCreacion')!.value;
    let dia: Dia = new Dia();
    dia.codigo = this.formularioHorario.get('diaAuxiliar')!.value;
    horario.dia = dia;
    horario.estado = this.formularioHorario.get('estado')!.value;

    if (this.editar) {
      this.actualizar(horario);
    } else {
      this.registrar(horario);
    }
    this.cargando = false;
  }

  editarHorario(element: Horario) {
    this.editar = true;
    this.estado = element.estado;
    this.buscarSubsede(element.puestoVigilancia.sede.codigo);
    this.formularioHorario.get('codigo')!.setValue(element.codigo);
    this.formularioHorario
      .get('sede')!
      .setValue(element.puestoVigilancia.sede.codigo);
    this.formularioHorario
      .get('subsede')!
      .setValue(element.puestoVigilancia.subsede.codigo);
    this.formularioHorario
      .get('tipo')!
      .setValue(element.puestoVigilancia.tipoPuesto.codigo);
    this.obtenerPuestoVigilanciaSubsedeTipo();
    this.formularioHorario
      .get('puesto')!
      .setValue(element.puestoVigilancia.codigo);
    this.formularioHorario.get('apertura')!.setValue(element.horaApertura);
    this.correrHoras(0);
    this.formularioHorario.get('cierre')!.setValue(element.horaCierre);
    this.formularioHorario
      .get('fechaCreacion')!
      .setValue(element.fechaCreacion);
    this.formularioHorario.get('diaAuxiliar')!.setValue(element.dia.codigo);
    this.formularioHorario.get('estado')!.setValue(element.estado);
  }

  registrar(horario: Horario) {
    this.horarioService.registrarHorario(horario).subscribe(
      (data) => {
        if (data > 0) {
          swal.fire({
            icon: 'success',
            title: 'Registrado',
            text: '¡Operación exitosa!',
            showConfirmButton: false,
            timer: 2500,
          });
          this.cancelar();
          this.obtenerHorarios();
        } else {
          this.mensajeError();
        }
      },
      (err) => this.fError(err)
    );
  }

  actualizar(horario: Horario) {
    this.horarioService.actualizarHorario(horario).subscribe(
      (data) => {
        if (data > 0) {
          swal.fire({
            icon: 'success',
            title: 'Actualizado',
            text: '¡Operación exitosa!',
            showConfirmButton: false,
            timer: 2500,
          });
          this.cancelar();
          this.obtenerHorarios();
        } else {
          this.mensajeError();
        }
      },
      (err) => this.fError(err)
    );
  }

  desactivarHorario() {
    let horario: Horario = new Horario();
    horario.codigo = this.formularioHorario.get('codigo')!.value;
    let puesto: PuestoVigilancia = new PuestoVigilancia();
    puesto.codigo = this.formularioHorario.get('puesto')!.value;
    horario.puestoVigilancia = puesto;
    horario.horaApertura = this.formularioHorario.get('apertura')!.value;
    horario.horaCierre = this.formularioHorario.get('cierre')!.value;
    horario.fechaCreacion = this.formularioHorario.get('fechaCreacion')!.value;
    horario.fechaCierre = new Date();
    let dia: Dia = new Dia();
    dia.codigo = this.formularioHorario.get('diaAuxiliar')!.value;
    horario.dia = dia;
    horario.estado = 0;
    this.actualizar(horario);
  }

  activarHorario() {
    let horario: Horario = new Horario();
    horario.codigo = this.formularioHorario.get('codigo')!.value;
    let puesto: PuestoVigilancia = new PuestoVigilancia();
    puesto.codigo = this.formularioHorario.get('puesto')!.value;
    horario.puestoVigilancia = puesto;
    horario.horaApertura = this.formularioHorario.get('apertura')!.value;
    horario.horaCierre = this.formularioHorario.get('cierre')!.value;
    horario.fechaCreacion = this.formularioHorario.get('fechaCreacion')!.value;
    horario.fechaCierre = new Date();
    let dia: Dia = new Dia();
    dia.codigo = this.formularioHorario.get('diaAuxiliar')!.value;
    horario.dia = dia;
    horario.estado = 1;
    this.actualizar(horario);
  }

  cancelar() {
    this.formularioHorario.reset();
    this.arregloDias = [];
    this.editar = false;
  }

  correrHoras(inicio: number) {
    this.horasCierre = this.horas.slice(inicio, this.horas.length);
  }

  selectAll() {
    if (this.arregloDias.length < 7) {
      this.arregloDias = [];
      this.dias.forEach((item) => this.agregarDia(item));
      this.allSelected.selectAll();
    } else {
      this.allSelected.deselectAll();
      this.arregloDias = [];
    }
  }

  agregarDia(item: any) {
    if (this.arregloDias.length === 0) {
      this.arregloDias.push(item);
    } else {
      var aux: number;
      aux = this.arregloDias.indexOf(item);
      if (aux === null || aux < 0) {
        this.arregloDias.push(item);
      } else {
        this.arregloDias.splice(aux);
      }
    }
  }

  obternerHoras() {
    this.horarioService.obtenerHora().subscribe((data) => {
      this.horas = data;
    });
  }

  obternerDias() {
    this.horarioService.obtenerDia().subscribe((data) => {
      this.dias = data;
    });
  }

  obtenerTipoPuesto() {
    this.puestoVigilanciaService.obtenerPuestoTipo().subscribe((data) => {
      this.tipoPuesto = data;
    });
  }

  obtenerSede() {
    this.ubicacionService.obtenerSedes().subscribe((data) => {
      this.sedes = data;
    });
  }

  obtenerPuestoVigilanciaSubsedeTipo() {
    this.puestoVigilanciaService
      .obtenerPuestoVigilanciaPorBloqueTipo(
        this.formularioHorario.get('subsede')!.value,
        this.formularioHorario.get('tipo')!.value
      )
      .subscribe((data) => {
        this.puestosFiltro = data;
      });
  }

  obtenerPuestoVigilanciaSubsedeTipoHorarioCompleto() {
    this.puestoVigilanciaService
      .obtenerPuestoVigilanciaPorBloqueTipoSinHorarioCompleto(
        this.formularioHorario.get('subsede')!.value,
        this.formularioHorario.get('tipo')!.value
      )
      .subscribe((data) => {
        this.puestosFiltro = data;
      });
  }

  cupos(codigo: number) {
    switch (codigo) {
      case 1:
        this.peatonal = true;
        this.vehicular = false;
        this.bicicletas = false;
        this.formularioHorario.get('carro')!.setValue(0);
        this.formularioHorario.get('moto')!.setValue(0);
        this.formularioHorario.get('bicicleta')!.setValue(0);
        break;
      case 2:
        this.vehicular = true;
        this.bicicletas = false;
        this.peatonal = false;
        break;
      case 3:
        this.bicicletas = true;
        this.vehicular = false;
        this.peatonal = false;
        break;
      default:
        this.peatonal = false;
        this.vehicular = false;
        this.bicicletas = false;
        break;
    }
  }

  buscarBloque(codigo: number) {
    this.ubicacionService.buscarBloques(codigo).subscribe((data) => {
      this.bloques = data;
    });
  }

  buscarSubsede(codigo: number) {
    this.ubicacionService.buscarSubSedes(codigo).subscribe((data) => {
      this.subsedes = data;
    });
  }

  mensajeError() {
    swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Algo salió mal',
      showConfirmButton: true,
      confirmButtonText: 'Listo',
      confirmButtonColor: '#8f141b',
      timer: 2500,
    });
  }

  mensajeExito() {
    const Toast = swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', swal.stopTimer);
        toast.addEventListener('mouseleave', swal.resumeTimer);
      },
    });

    Toast.fire({
      icon: 'success',
      title: 'La operación culminó de manera exitosa.',
    });
  }

  fError(er: any): void {
    let err = er.error.error_description;
    let arr: string[] = err.split(':');

    if (arr[0] == 'Access token expired') {
      this.authService.logout();
      this.router.navigate(['login']);
    } else {
      this.mensajeError();
    }
  }
}
