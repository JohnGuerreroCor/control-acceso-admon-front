import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { TipoDocumentoService } from '../../../services/tipo-documento.service';
import { TipoDocumento } from '../../../models/tipo-documento';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
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
import { VigilanteService } from '../../../services/vigilante.service';
import { Vigilante } from 'src/app/models/vigilante';
import { Asignacion } from 'src/app/models/asignacion';
import { AsignacionService } from '../../../services/asignacion.service';
import { Asignado } from 'src/app/models/asignado';
import swal from 'sweetalert2';

@Component({
  selector: 'app-asignacion',
  templateUrl: './asignacion.component.html',
  styleUrls: ['./asignacion.component.css'],
  providers: [DatePipe],
})
export class AsignacionComponent implements OnInit {
  //Arreglos
  tipoDocumentos: TipoDocumento[] = [];
  sedes: Sede[] = [];
  subsedes: SubSede[] = [];
  bloques: Bloque[] = [];
  tipoPuesto: PuestoTipo[] = [];
  puestosFiltro: PuestoVigilancia[] = [];
  cuposVigilantes: Vigilante[] = [];
  vigilantes: Vigilante[] = [];
  vigilanteSeleccion: Vigilante[] = [];
  selectedOptions: number[] = [];
  asignaciones: Asignacion[] = [];
  asignacionesActivas: Asignacion[] = [];
  asignacionPuesto: Asignacion[] = [];
  asignados: Asignado[] = [];

  //Booleanos
  tipoLugar: boolean = true;
  terceroExiste!: boolean;
  editar: boolean = false;
  tablaCupos: boolean = false;

  //Complementos

  tipo!: any;
  nombrePuesto!: any;
  cupoMaximo!: any;

  newAttribute: any = {};
  asignacion: any = {
    fieldArray: [],
  };

  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = [
    'index',
    'sede',
    'subsede',
    'tipo',
    'nombre',
    'vigilantes',
    'asignados',
    'informacion',
  ];
  @ViewChild(MatPaginator, { static: false })
  paginator!: MatPaginator;

  formularioAsignacion!: FormGroup;
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
    public vigilanteService: VigilanteService,
    public asignacionService: AsignacionService,
    public dialog: MatDialog,
    private authService: AuthService,
    private router: Router,
    private datePipe: DatePipe
  ) {
    if (this.authService.validacionToken()) {
      this.obtenerSede();
      this.obtenerPuestoVigilancia();
    }
  }

  ngOnInit() {
    this.crearFormularioAsignacion();
    this.obtenerTipoPuesto();
    this.obtenerVigilanstes();
    this.obtenerVigilanstesGeneral();
    this.obtenerAsignaciones();
    this.obtenerAsignacionesActivasComparar();
    this.obtenerAsignados();
  }

  scrollToComponent(page: HTMLElement) {
    page.scrollIntoView({ behavior: 'smooth' });
  }

  obtenerVigilanstes() {
    this.vigilanteService.obtenerVigilantesSinAsignacion().subscribe((data) => {
      this.vigilantes = data;
    });
  }

  obtenerVigilanstesGeneral() {
    this.vigilanteService.obtenerVigilantesActivos().subscribe((data) => {
      this.vigilanteSeleccion = data;
    });
  }

  agregarVigilante() {
    this.asignacion.fieldArray.push(this.newAttribute);
    const index = this.vigilantes.findIndex(
      (persona) => persona.codigo === this.newAttribute.vigilante
    );
    if (index !== -1) {
      this.vigilantes.splice(index, 1);
    }
    this.newAttribute = {};
  }

  deleteFieldValue(index: any, codigoVigilante: any) {
    this.asignacion.fieldArray.splice(index, 1);
    this,
      this.vigilanteService
        .obtenerVigilanteCodigo(codigoVigilante)
        .subscribe((data) => {
          this.vigilantes.push(data[0]);
        });
  }

  obtenerAsignaciones() {
    this.asignacionService.obtenerAsignaciones().subscribe((data) => {
      this.asignaciones = data;
    });
  }

  obtenerAsignados() {
    this.asignacionService.obtenerAsgignados().subscribe((data) => {
      this.asignados = data;
      this.dataSource = new MatTableDataSource<Asignado>(data);
      this.paginator.firstPage();
      this.dataSource.paginator = this.paginator;
    });
  }

  obtenerAsignacionesActivasComparar() {
    this.asignacionService.obtenerAsignacionesActivas().subscribe((data) => {
      if (JSON.stringify(data) !== '[]') {
        for (let j = 0; j < data.length; j++) {
          const index = this.vigilantes.findIndex(
            (persona) => persona.codigo === data[j].vigilante.codigo
          );
          if (index !== -1) {
            this.vigilantes.splice(index, 1);
          }
        }
      }
      this.asignacionesActivas = data;
    });
  }

  obtenerPuestoVigilancia() {
    this.puestoVigilanciaService
      .obtenerPuestoVigilancia()
      .subscribe((data) => {});
  }

  obtenerPuestoVigilanciaSubsedeTipo() {
    this.tablaCupos = false;
    this.puestoVigilanciaService
      .obtenerPuestoVigilanciaPorBloqueTipoHorario(
        this.formularioAsignacion.get('subsede')!.value,
        this.formularioAsignacion.get('tipo')!.value
      )
      .subscribe((data) => {
        this.puestosFiltro = data;
      });
  }

  vincularVigilante(element: any, index: any) {
    let asignacion: Asignacion = new Asignacion();
    let puestoVigilancia: PuestoVigilancia = new PuestoVigilancia();
    puestoVigilancia.codigo = this.formularioAsignacion.get('puesto')!.value;
    asignacion.puesto = puestoVigilancia;
    let vigilante: Vigilante = new Vigilante();
    vigilante.codigo = element.fieldArray[index].vigilante;
    asignacion.vigilante = vigilante;
    asignacion.observacion = element.fieldArray[index].observacion;
    this.registrarAsignacion(asignacion);
  }

  desvincularVigilante(element: any) {
    let asignacion: Asignacion = new Asignacion();
    asignacion.codigo = element.codigo;
    let puestoVigilancia: PuestoVigilancia = new PuestoVigilancia();
    puestoVigilancia.codigo = this.formularioAsignacion.get('puesto')!.value;
    asignacion.puesto = puestoVigilancia;
    let vigilante: Vigilante = new Vigilante();
    vigilante.codigo = element.vigilante;
    asignacion.vigilante = vigilante;
    asignacion.fechaRetiro = new Date();
    asignacion.estado = 0;
    this.actualizar(asignacion);
  }

  generarCuposVigilantes(element: PuestoVigilancia) {
    this.asignacion.fieldArray = [];
    this.nombrePuesto = element.nombre;
    this.cupoMaximo = element.cupoVigilante;
    this.asignacionService
      .obtenerAsignacionesCodigoPuesto(element.codigo)
      .subscribe((data) => {
        this.asignacionPuesto = data;
        if (JSON.stringify(data) !== '[]') {
          this.asignacion.fieldArray = data;
          for (let index = 0; index < data.length; index++) {
            this.asignacion.fieldArray[index].vigilante =
              data[index].vigilante.codigo;
          }
        }
      });
    this.tablaCupos = true;
  }

  private crearFormularioAsignacion(): void {
    this.formularioAsignacion = this.formBuilder.group({
      codigo: new FormControl(''),
      sede: new FormControl('', Validators.required),
      subsede: new FormControl('', Validators.required),
      tipo: new FormControl('', Validators.required),
      puesto: new FormControl('', Validators.required),
      fechaCreacion: new FormControl(''),
      vigilante: new FormControl(''),
      estado: new FormControl(''),
    });
  }

  generarAsignacion(): void {
    for (let index = 0; index < this.asignacion.fieldArray.length; index++) {
      let asignacion: Asignacion = new Asignacion();
      let puestoVigilancia: PuestoVigilancia = new PuestoVigilancia();
      puestoVigilancia.codigo = this.formularioAsignacion.get('puesto')!.value;
      asignacion.puesto = puestoVigilancia;
      let vigilante: Vigilante = new Vigilante();
      vigilante.codigo = this.asignacion.fieldArray[index].vigilante;
      asignacion.vigilante = vigilante;
      asignacion.observacion = this.asignacion.fieldArray[index].observacion;

      if (this.editar) {
        this.actualizar(asignacion);
      } else {
        this.registrarAsignacion(asignacion);
      }
    }
  }

  editarAsignacion(element: Asignado) {
    this.editar = true;
    this.buscarSubsede(element.sedeCodigo);
    this.formularioAsignacion.get('codigo')!.setValue(element.codigo);
    this.formularioAsignacion.get('sede')!.setValue(element.sedeCodigo);
    this.formularioAsignacion.get('subsede')!.setValue(element.subsedeCodigo);
    this.formularioAsignacion.get('tipo')!.setValue(element.tipoPuestoCodigo);
    this.obtenerPuestoVigilanciaSubsedeTipo();
    this.formularioAsignacion.get('puesto')!.setValue(element.codigo);
    let puestoVigilancia: PuestoVigilancia = new PuestoVigilancia();
    puestoVigilancia.codigo = element.codigo;
    puestoVigilancia.nombre = element.nombrePuesto;
    puestoVigilancia.cupoVigilante = element.cupoVigilante;
    this.generarCuposVigilantes(puestoVigilancia);
    this.formularioAsignacion.get('fechaCreacion')!.setValue(new Date());
    this.formularioAsignacion.get('estado')!.setValue(element.estado);
  }

  registrarAsignacion(asignacion: Asignacion) {
    this.asignacionService.registrarAsignación(asignacion).subscribe(
      (data) => {
        if (data > 0) {
          swal.fire({
            icon: 'success',
            title: 'Registrado',
            text: '¡Operación exitosa!',
            showConfirmButton: true,
            confirmButtonColor: '#8f141b',
            confirmButtonText: 'Listo',
          });
          this.cancelar();
          this.obtenerPuestoVigilancia();
          this.obtenerAsignados();
          this.tablaCupos = false;
        } else {
          this.mensajeError();
        }
      },
      (err) => this.fError(err)
    );
  }

  actualizar(asignacion: Asignacion) {
    this.asignacionService.actualizarAsignacion(asignacion).subscribe(
      (data) => {
        if (data > 0) {
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
            title: 'Actualizado',
            text: '¡Operación exitosa!',
          });
          this.obtenerPuestoVigilancia();
          this.obtenerAsignados();
        } else {
          this.mensajeError();
        }
      },
      (err) => this.fError(err)
    );
  }

  desactivarPuestoVigilancia() {
    let asignacion: Asignacion = new Asignacion();
    let puestoVigilancia: PuestoVigilancia = new PuestoVigilancia();
    puestoVigilancia.codigo = this.formularioAsignacion.get('puesto')!.value;
    asignacion.puesto = puestoVigilancia;
    let vigilante: Vigilante = new Vigilante();
    vigilante.codigo = this.formularioAsignacion.get('vigilante')!.value;
    asignacion.vigilante = vigilante;

    this.actualizar(asignacion);
  }

  openDialog(element: any): void {
    const dialogRef = this.dialog.open(ModalInformacionAsignacion, {
      width: '60%',
      data: { asignacion: element },
    });
  }

  cancelar() {
    this.formularioAsignacion.reset();
    this.editar = false;
    this.tablaCupos = false;
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

  buscarSubsede(codigo: number) {
    this.ubicacionService.buscarSubSedes(codigo).subscribe((data) => {
      this.subsedes = data;
    });
  }

  mensajeError() {
    swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo completar el proceso.',
      showConfirmButton: true,
      confirmButtonText: 'Listo',
      confirmButtonColor: '#8f141b',
      timer: 2500,
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

//// MODAL

@Component({
  selector: 'modal-informacion-asignacion',
  templateUrl: 'modal-informacion-asignacion.html',
  styleUrls: ['./asignacion.component.css'],
})
export class ModalInformacionAsignacion implements OnInit {
  asignaciones: Asignacion[] = [];
  vigilantes: Vigilante[] = [];

  constructor(
    public dialogRef: MatDialogRef<ModalInformacionAsignacion>,
    public dialog: MatDialog,
    public asignacionService: AsignacionService,
    public vigilanteService: VigilanteService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.asignacionService
      .obtenerAsignacionesCodigoPuesto(data.asignacion.codigo)
      .subscribe((data) => {
        this.asignaciones = data;
      });
    this.vigilanteService.obtenerVigilantes().subscribe((data) => {
      this.vigilantes = data;
    });
  }

  ngOnInit() {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
