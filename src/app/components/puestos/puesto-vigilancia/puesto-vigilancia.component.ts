import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { PuestoVigilanciaService } from '../../../services/puesto-vigilancia.service';
import { TipoDocumentoService } from '../../../services/tipo-documento.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { UbicacionService } from '../../../services/ubicacion.service';
import { PuestoVigilancia } from '../../../models/puesto-vigilancia';
import { TipoDocumento } from '../../../models/tipo-documento';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from '../../../services/auth.service';
import { MatPaginator } from '@angular/material/paginator';
import { PuestoTipo } from '../../../models/puesto-tipo';
import { SubSede } from '../../../models/sub-sede';
import { Bloque } from 'src/app/models/bloque';
import { Sede } from '../../../models/sede';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'app-puesto-vigilancia',
  templateUrl: './puesto-vigilancia.component.html',
  styleUrls: ['./puesto-vigilancia.component.css'],
  providers: [DatePipe],
})
export class PuestoVigilanciaComponent implements OnInit {
  //Arreglos
  tipoDocumentos: TipoDocumento[] = [];
  sedes: Sede[] = [];
  subsedes: SubSede[] = [];
  bloques: Bloque[] = [];
  tipoPuesto: PuestoTipo[] = [];

  //Booleanos
  tipoLugar: boolean = true;
  terceroExiste!: boolean;
  ticket: boolean = false;
  botonesTickets: boolean = false;
  peatonal: boolean = false;
  vehicular: boolean = false;
  bicicletas: boolean = false;
  editar: boolean = false;
  nombre: boolean = false;

  //Complementos

  tipo!: String;
  alert: boolean = true;

  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = [
    'index',
    'sede',
    'subsede',
    'nombre',
    'tipo',
    'vigilantes',
    'fecha',
    'informacion',
  ];
  @ViewChild(MatPaginator, { static: false })
  paginator!: MatPaginator;

  qrCodeTwo: any = null;
  formularioPuestoVigilancia!: FormGroup;
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
    public dialog: MatDialog,
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

  scrollToComponent(page: HTMLElement) {
    page.scrollIntoView({ behavior: 'smooth' });
  }

  ngOnInit() {
    setTimeout(() => {
      this.alert = false;
    }, 9000);
    this.crearFormularioTercero();
    this.formularioPuestoVigilancia
      .get('nombre')!
      .valueChanges.subscribe((value) => {
        this.formularioPuestoVigilancia
          .get('nombre')!
          .setValue(value.toUpperCase(), { emitEvent: false });
      });
    this.obtenerTipoPuesto();
    this.formularioPuestoVigilancia
      .get('nombre')!
      .setValue('PUESTO VIGILANCIA - ');
  }

  obtenerPuestoVigilancia() {
    this.puestoVigilanciaService.obtenerPuestoVigilancia().subscribe((data) => {
      this.dataSource = new MatTableDataSource<PuestoVigilancia>(data);
      this.paginator.firstPage();
      this.dataSource.paginator = this.paginator;
    });
  }

  private crearFormularioTercero(): void {
    this.formularioPuestoVigilancia = this.formBuilder.group({
      //Vaiables Entidad Tercero
      codigo: new FormControl(''),
      nombre: new FormControl('', Validators.required),
      sede: new FormControl('', Validators.required),
      subsede: new FormControl('', Validators.required),
      bloque: new FormControl('', Validators.required),
      tipo: new FormControl('', Validators.required),
      fechaCreacion: new FormControl(''),
      vigilante: new FormControl(''),
      carro: new FormControl(''),
      moto: new FormControl(''),
      bicicleta: new FormControl(''),
      estado: new FormControl(''),
    });
  }

  generarPuestoVigilancia(): void {
    let puestoVigilancia: PuestoVigilancia = new PuestoVigilancia();
    puestoVigilancia.codigo =
      this.formularioPuestoVigilancia.get('codigo')!.value;
    puestoVigilancia.nombre = this.formularioPuestoVigilancia
      .get('nombre')!
      .value.toUpperCase();
    let sede: Sede = new Sede();
    sede.codigo = this.formularioPuestoVigilancia.get('sede')!.value;
    puestoVigilancia.sede = sede;
    let subsede: SubSede = new SubSede();
    subsede.codigo = this.formularioPuestoVigilancia.get('subsede')!.value;
    puestoVigilancia.subsede = subsede;
    let bloque: Bloque = new Bloque();
    bloque.codigo = this.formularioPuestoVigilancia.get('bloque')!.value;
    puestoVigilancia.bloque = bloque;
    puestoVigilancia.cupoVigilante =
      this.formularioPuestoVigilancia.get('vigilante')!.value;
    puestoVigilancia.cupoCarro =
      this.formularioPuestoVigilancia.get('carro')!.value;
    puestoVigilancia.cupoMoto =
      this.formularioPuestoVigilancia.get('moto')!.value;
    puestoVigilancia.cupoBicicleta =
      this.formularioPuestoVigilancia.get('bicicleta')!.value;
    let tipo: PuestoTipo = new PuestoTipo();
    tipo.codigo = this.formularioPuestoVigilancia.get('tipo')!.value;
    puestoVigilancia.tipoPuesto = tipo;
    puestoVigilancia.estado =
      this.formularioPuestoVigilancia.get('estado')!.value;
    puestoVigilancia.fechaCreacion =
      this.formularioPuestoVigilancia.get('fechaCreacion')!.value;

    if (this.editar) {
      this.actualizar(puestoVigilancia);
    } else {
      this.registrarPuestoVigilancia(puestoVigilancia);
    }
  }

  editarPuestoVigilancia(element: PuestoVigilancia) {
    this.editar = true;
    this.cupos(element.tipoPuesto.codigo);
    this.buscarSubsede(element.sede.codigo);
    this.buscarBloque(element.subsede.codigo);
    this.formularioPuestoVigilancia.get('codigo')!.setValue(element.codigo);
    this.formularioPuestoVigilancia.get('nombre')!.setValue(element.nombre);
    this.formularioPuestoVigilancia.get('sede')!.setValue(element.sede.codigo);
    this.formularioPuestoVigilancia
      .get('subsede')!
      .setValue(element.subsede.codigo);
    this.formularioPuestoVigilancia
      .get('bloque')!
      .setValue(element.bloque.codigo);
    this.formularioPuestoVigilancia
      .get('vigilante')!
      .setValue(element.cupoVigilante);
    this.formularioPuestoVigilancia.get('carro')!.setValue(element.cupoCarro);
    this.formularioPuestoVigilancia.get('moto')!.setValue(element.cupoMoto);
    this.formularioPuestoVigilancia
      .get('bicicleta')!
      .setValue(element.cupoBicicleta);
    this.formularioPuestoVigilancia
      .get('tipo')!
      .setValue(element.tipoPuesto.codigo);
    this.formularioPuestoVigilancia.get('estado')!.setValue(element.estado);
    this.formularioPuestoVigilancia
      .get('fechaCreacion')!
      .setValue(element.fechaCreacion);
  }

  registrarPuestoVigilancia(puestoVigilancia: PuestoVigilancia) {
    this.puestoVigilanciaService
      .registrarPuestoVigilancia(puestoVigilancia)
      .subscribe(
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
            this.obtenerPuestoVigilancia();
          } else {
            this.mensajeError();
          }
        },
        (err) => this.fError(err)
      );
  }

  actualizar(puestoVigilancia: PuestoVigilancia) {
    this.puestoVigilanciaService
      .actualizarPuestoVigilancia(puestoVigilancia)
      .subscribe(
        (data) => {
          if (data > 0) {
            swal.fire({
              icon: 'success',
              title: 'Actualizado',
              text: '¡Operación exitosa!',
              toast: true,
              position: 'top-right',
              timer: 2500,
            });
            this.cancelar();
            this.obtenerPuestoVigilancia();
          } else {
            this.mensajeError();
          }
        },
        (err) => this.fError(err)
      );
  }

  desactivarPuestoVigilancia() {
    let puestoVigilancia: PuestoVigilancia = new PuestoVigilancia();
    puestoVigilancia.codigo =
      this.formularioPuestoVigilancia.get('codigo')!.value;
    puestoVigilancia.nombre =
      this.formularioPuestoVigilancia.get('nombre')!.value;
    let sede: Sede = new Sede();
    sede.codigo = this.formularioPuestoVigilancia.get('sede')!.value;
    puestoVigilancia.sede = sede;
    let subsede: SubSede = new SubSede();
    subsede.codigo = this.formularioPuestoVigilancia.get('subsede')!.value;
    puestoVigilancia.subsede = subsede;
    let bloque: Bloque = new Bloque();
    bloque.codigo = this.formularioPuestoVigilancia.get('bloque')!.value;
    puestoVigilancia.bloque = bloque;
    puestoVigilancia.cupoVigilante =
      this.formularioPuestoVigilancia.get('vigilante')!.value;
    puestoVigilancia.cupoCarro =
      this.formularioPuestoVigilancia.get('carro')!.value;
    puestoVigilancia.cupoMoto =
      this.formularioPuestoVigilancia.get('moto')!.value;
    puestoVigilancia.cupoBicicleta =
      this.formularioPuestoVigilancia.get('bicicleta')!.value;
    let tipo: PuestoTipo = new PuestoTipo();
    tipo.codigo = this.formularioPuestoVigilancia.get('tipo')!.value;
    puestoVigilancia.tipoPuesto = tipo;
    puestoVigilancia.fechaCierre = new Date();
    puestoVigilancia.estado = 0;
    this.actualizar(puestoVigilancia);
  }

  cancelar() {
    this.formularioPuestoVigilancia.get('codigo')!.reset();
    this.formularioPuestoVigilancia
      .get('nombre')!
      .setValue('PUESTO VIGILANCIA - ');
    this.formularioPuestoVigilancia.get('sede')!.reset();
    this.formularioPuestoVigilancia.get('subsede')!.reset();
    this.formularioPuestoVigilancia.get('bloque')!.reset();
    this.formularioPuestoVigilancia.get('vigilante')!.reset();
    this.formularioPuestoVigilancia.get('carro')!.reset();
    this.formularioPuestoVigilancia.get('moto')!.reset();
    this.formularioPuestoVigilancia.get('bicicleta')!.reset();
    this.formularioPuestoVigilancia.get('tipo')!.reset();
    this.formularioPuestoVigilancia.get('estado')!.reset();
    this.formularioPuestoVigilancia.get('fechaCreacion')!.reset();
    this.editar = false;
  }

  openDialog(element: any): void {
    const dialogRef = this.dialog.open(ModalInformacionPuesto, {
      width: '60%',
      data: { puesto: element },
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

  cupos(codigo: number) {
    this.nombre = true;
    switch (codigo) {
      case 1:
        this.peatonal = true;
        this.vehicular = false;
        this.bicicletas = false;
        this.formularioPuestoVigilancia.get('carro')!.setValue(0);
        this.formularioPuestoVigilancia.get('moto')!.setValue(0);
        this.formularioPuestoVigilancia.get('bicicleta')!.setValue(0);
        this.tipo = 'PUESTO VIGILANCIA - ENTRADA';
        break;
      case 2:
        this.vehicular = true;
        this.bicicletas = false;
        this.peatonal = false;
        this.tipo = 'PUESTO VIGILANCIA - PARQUEADERO';
        break;
      case 3:
        this.bicicletas = true;
        this.vehicular = false;
        this.peatonal = false;
        this.tipo = 'PUESTO VIGILANCIA - PARQUEADERO';
        break;
      default:
        this.peatonal = false;
        this.vehicular = false;
        this.bicicletas = false;
        break;
    }
  }

  buscarBloque(codigo: number) {
    this.formularioPuestoVigilancia.get('bloque')!.reset;
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
      confirmButtonColor: '#8f141b',
      showConfirmButton: true,
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
  selector: 'modal-informacion-puesto',
  templateUrl: 'modal-informacion-puesto.html',
  styleUrls: ['./puesto-vigilancia.component.css'],
})
export class ModalInformacionPuesto implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<ModalInformacionPuesto>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
