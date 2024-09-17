import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { TipoDocumentoService } from '../../../services/tipo-documento.service';
import { TipoDocumento } from '../../../models/tipo-documento';
import { TerceroService } from '../../../services/tercero.service';
import { Tercero } from '../../../models/tercero';
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
import { UbicacionService } from '../../../services/ubicacion.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Persona } from '../../../models/persona';
import { PersonaService } from '../../../services/persona.service';
import swal from 'sweetalert2';
import { Vigilante } from 'src/app/models/vigilante';
import { VigilanteService } from '../../../services/vigilante.service';

@Component({
  selector: 'app-vigilante',
  templateUrl: './vigilante.component.html',
  styleUrls: ['./vigilante.component.css'],
  providers: [DatePipe],
})
export class VigilanteComponent implements OnInit {
  //Arreglos
  tipoDocumentos: TipoDocumento[] = [];
  vigilantes: Vigilante[] = [];
  tercero: Tercero[] = [];
  persona: Persona[] = [];
  emails = [];

  //Booleanos
  terceroExiste!: boolean;
  ipuntEmailPersona: boolean = false;
  editar: boolean = false;

  //Complementos

  dataSource = new MatTableDataSource<Vigilante>([]);
  displayedColumns: string[] = [
    'index',
    'id',
    'nombre',
    'correo',
    'registro',
    'retiro',
    'opciones',
  ];
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  formularioVigilante!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public vigilanteService: VigilanteService,
    public tipoDocumentoService: TipoDocumentoService,
    public terceroService: TerceroService,
    public ubicacionService: UbicacionService,
    public personaService: PersonaService,
    public dialog: MatDialog,
    private authService: AuthService,
    private router: Router,
    private datePipe: DatePipe
  ) {
    if (this.authService.validacionToken()) {
      this.obtenerTipoDocumento();
    }
  }

  ngOnInit() {
    this.crearFormularioVigilante();
    this.obtenerVigilanstes();
    this.formularioVigilante.get('nombre')!.valueChanges.subscribe((value) => {
      this.formularioVigilante
        .get('nombre')!
        .setValue(value.toUpperCase(), { emitEvent: false });
    });
    this.formularioVigilante
      .get('apellido')!
      .valueChanges.subscribe((value) => {
        this.formularioVigilante
          .get('apellido')!
          .setValue(value.toUpperCase(), { emitEvent: false });
      });
    this.formularioVigilante.get('empresa')!.valueChanges.subscribe((value) => {
      this.formularioVigilante
        .get('empresa')!
        .setValue(value.toUpperCase(), { emitEvent: false });
    });
    this.formularioVigilante.get('email')!.valueChanges.subscribe((value) => {
      this.formularioVigilante
        .get('email')!
        .setValue(value.toLowerCase(), { emitEvent: false });
    });
  }

  private crearFormularioVigilante(): void {
    this.formularioVigilante = this.formBuilder.group({
      codigo: new FormControl(''),
      documento: new FormControl(''),
      identificacion: new FormControl('', [
        Validators.required,
        Validators.maxLength(15),
      ]),
      nombre: new FormControl(''),
      apellido: new FormControl(''),
      email: new FormControl('', [Validators.required, Validators.email]),
      empresa: new FormControl(''),
    });
  }

  mayuscula() {
    this.formularioVigilante.get('nombre')!.valueChanges.subscribe((value) => {
      this.formularioVigilante
        .get('nombre')!
        .setValue(value.toUpperCase(), { emitEvent: false });
    });
    this.formularioVigilante
      .get('apellido')!
      .valueChanges.subscribe((value) => {
        this.formularioVigilante
          .get('apellido')!
          .setValue(value.toUpperCase(), { emitEvent: false });
      });
    this.formularioVigilante.get('empresa')!.valueChanges.subscribe((value) => {
      this.formularioVigilante
        .get('empresa')!
        .setValue(value.toUpperCase(), { emitEvent: false });
    });
    this.formularioVigilante.get('email')!.valueChanges.subscribe((value) => {
      this.formularioVigilante
        .get('email')!
        .setValue(value.toLowerCase(), { emitEvent: false });
    });
  }

  obtenerVigilanstes() {
    this.vigilanteService.obtenerVigilantes().subscribe((data) => {
      this.vigilantes = data;
      this.dataSource = new MatTableDataSource<Vigilante>(data);
      this.paginator.firstPage();
      this.dataSource.paginator = this.paginator;
    });
  }

  obtenerTipoDocumento() {
    this.tipoDocumentoService.getTiposDocumentos().subscribe((data) => {
      this.tipoDocumentos = data;
    });
  }

  openDialog(element: any): void {
    const dialogRef = this.dialog.open(ModalInformacionVigilante, {
      width: '60%',
      data: { vigilante: element },
    });
  }

  buscarPersona() {
    this.personaService
      .obtenerPersonaPorIdentificacion(
        this.formularioVigilante.get('identificacion')!.value
      )
      .subscribe((data) => {
        if (JSON.stringify(data) !== '[]') {
          this.persona = data;
          this.obtenerTipoDocumento();
          this.formularioVigilante
            .get('documento')!
            .setValue(this.persona[0].tipoDocumento);
          this.formularioVigilante
            .get('nombre')!
            .setValue(this.persona[0].nombre);
          this.formularioVigilante
            .get('apellido')!
            .setValue(this.persona[0].apellido);
          this.formularioVigilante
            .get('email')!
            .setValue(this.persona[0].emailPersonal);
        } else {
          this.buscarTercero();
        }
      });
  }

  buscarTercero() {
    this.terceroService
      .getTerceroId(this.formularioVigilante.get('identificacion')!.value)
      .subscribe((data) => {
        if (JSON.stringify(data) !== '[]') {
          this.tercero = data;
          this.formularioVigilante
            .get('documento')!
            .setValue(this.tercero[0].tipoDocumento);
          this.formularioVigilante
            .get('nombre')!
            .setValue(this.tercero[0].nombre1 + ' ' + this.tercero[0].nombre2);
          this.formularioVigilante
            .get('apellido')!
            .setValue(
              this.tercero[0].apellido1 + ' ' + this.tercero[0].apellido2
            );
          this.formularioVigilante
            .get('email')!
            .setValue(this.tercero[0].email);
        } else {
          this.obtenerTipoDocumento();
        }
      });
  }

  generarVigilante(): void {
    let vigilante: Vigilante = new Vigilante();
    vigilante.codigo = this.formularioVigilante.get('codigo')!.value;
    let documento: TipoDocumento = new TipoDocumento();
    documento.codigo = this.formularioVigilante.get('documento')!.value;
    vigilante.documento = documento;
    vigilante.identificacion =
      this.formularioVigilante.get('identificacion')!.value;
    vigilante.nombre = this.formularioVigilante
      .get('nombre')!
      .value.toUpperCase();
    vigilante.apellido = this.formularioVigilante
      .get('apellido')!
      .value.toUpperCase();
    vigilante.correo = this.formularioVigilante
      .get('email')!
      .value.toLowerCase();
    vigilante.empresa = this.formularioVigilante
      .get('empresa')!
      .value.toUpperCase();

    if (this.editar) {
      this.actualizarVigilante(vigilante);
    } else {
      this.registrarVigilante(vigilante);
    }
  }

  editarVigilante(element: Vigilante) {
    this.editar = true;
    this.formularioVigilante.get('codigo')!.setValue(element.codigo);
    this.formularioVigilante
      .get('documento')!
      .setValue(element.documento.codigo);
    this.formularioVigilante
      .get('identificacion')!
      .setValue(element.identificacion);
    this.formularioVigilante.get('nombre')!.setValue(element.nombre);
    this.formularioVigilante.get('apellido')!.setValue(element.apellido);
    this.formularioVigilante.get('email')!.setValue(element.correo);
    this.formularioVigilante.get('empresa')!.setValue(element.empresa);
  }

  registrarVigilante(vigilante: Vigilante) {
    this.vigilanteService.registrarVigilante(vigilante).subscribe(
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
          this.crearFormularioVigilante();
          this.obtenerVigilanstes();
        } else {
          this.mensajeError();
        }
      },
      (err) => this.fError(err)
    );
  }

  actualizarVigilante(vigilante: Vigilante) {
    this.vigilanteService.actualizarVigilante(vigilante).subscribe(
      (data) => {
        if (data > 0) {
          swal.fire({
            icon: 'success',
            title: 'Actualizado',
            text: '¡Operación exitosa!',
            showConfirmButton: true,
            confirmButtonColor: '#8f141b',
            timer: 2500,
          });
          this.cancelar();
          this.obtenerVigilanstes();
        } else {
          this.mensajeError();
        }
      },
      (err) => this.fError(err)
    );
  }

  desactivarVigilante() {
    let vigilante: Vigilante = new Vigilante();
    vigilante.codigo = this.formularioVigilante.get('codigo')!.value;
    let documento: TipoDocumento = new TipoDocumento();
    documento.codigo = this.formularioVigilante.get('documento')!.value;
    vigilante.documento = documento;
    vigilante.identificacion =
      this.formularioVigilante.get('identificacion')!.value;
    vigilante.nombre = this.formularioVigilante
      .get('nombre')!
      .value.toUpperCase();
    vigilante.apellido = this.formularioVigilante
      .get('apellido')!
      .value.toUpperCase();
    vigilante.correo = this.formularioVigilante.get('email')!.value;
    vigilante.empresa = this.formularioVigilante
      .get('empresa')!
      .value.toUpperCase();
    vigilante.fechaRetiro = new Date();
    vigilante.estado = 0;
    this.actualizarVigilante(vigilante);
  }

  cancelar() {
    this.formularioVigilante.get('documento')!.reset();
    this.formularioVigilante.get('identificacion')!.reset();
    this.formularioVigilante.get('nombre')!.setValue('');
    this.formularioVigilante.get('apellido')!.setValue('');
    this.formularioVigilante.get('email')!.setValue('');
    this.formularioVigilante.get('empresa')!.setValue('');
    this.obtenerTipoDocumento();
    this.editar = false;
  }

  irArriba(page: HTMLElement) {
    page.scrollIntoView();
  }

  mensajeAdvertencia() {
    swal.fire({
      icon: 'warning',
      title: 'Sin Resultados',
      text: 'No se encontró ninguna persona relacionada con el documento, por favor completar los campos necesarios para el registro.',
      showConfirmButton: false,
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
    });
  }

  mensajeSuccses() {
    swal.fire({
      icon: 'success',
      title: 'Proceso realizado',
      text: '¡Operación exitosa!',
      showConfirmButton: false,
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
  selector: 'modal-informacion-vigilante',
  templateUrl: 'modal-informacion-vigilante.html',
  styleUrls: ['./vigilante.component.css'],
})
export class ModalInformacionVigilante implements OnInit {
  tipoDocumentos: TipoDocumento[] = [];

  constructor(
    public dialogRef: MatDialogRef<ModalInformacionVigilante>,
    public tipoDocumentoService: TipoDocumentoService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.obtenerTipoDocumento();
  }

  obtenerTipoDocumento() {
    this.tipoDocumentoService.getTiposDocumentos().subscribe((data) => {
      this.tipoDocumentos = data;
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
