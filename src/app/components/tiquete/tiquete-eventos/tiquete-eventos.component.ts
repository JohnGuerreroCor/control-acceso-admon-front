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
import { Sede } from '../../../models/sede';
import { SubSede } from '../../../models/sub-sede';
import { Bloque } from '../../../models/bloque';
import { UbicacionService } from '../../../services/ubicacion.service';
import { Oficina } from '../../../models/oficina';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { Ticket } from '../../../models/ticket';
import { TicketService } from '../../../services/ticket.service';
import { DatePipe } from '@angular/common';
import { FotoAntigua } from 'src/app/models/foto-antigua';
import { Persona } from '../../../models/persona';
import { PersonaService } from '../../../services/persona.service';
import { GraduadoService } from '../../../services/graduado.service';
import { FirebaseFileService } from '../../../services/firebase-file.service';
import swal from 'sweetalert2';

import * as XLSX from 'xlsx';

@Component({
  selector: 'app-tiquete-eventos',
  templateUrl: './tiquete-eventos.component.html',
  styleUrls: ['./tiquete-eventos.component.css'],
  providers: [DatePipe],
})
export class TiqueteEventosComponent implements OnInit {
  //Arreglos
  tipoDocumentos: TipoDocumento[] = [];
  sedes: Sede[] = [];
  subsedes: SubSede[] = [];
  bloques: Bloque[] = [];
  oficinas: Oficina[] = [];

  tercero: Tercero[] = [];
  persona: Persona[] = [];
  emails: any = [];

  listaTickets: Ticket[] = [];

  //Booleanos
  tipoLugar: boolean = true;
  terceroExiste!: boolean;
  ipuntEmailPersona: boolean = false;
  personaExiste: boolean = false;
  graduadoExiste!: boolean;
  correoGraduado: boolean = false;
  ticket: boolean = false;
  botonesTickets: boolean = false;
  enviarTicketPersona: boolean = true;

  file!: any;
  nameFile = 'Seleccione el listado de invitados';
  formularioTiquetesEvento!: FormGroup;
  formTercero!: FormGroup;
  evento!: FormGroup;
  personas: any[] = [];
  filteredOptions!: Observable<Oficina[]>;
  myControl = new FormControl();

  logo: boolean = false;

  nuevos: any[] = [];

  per = 0;
  ter = 0;
  insert = 0;

  fechaLimiteMinima: any;
  fechaLimiteMinimaVigencia: any;

  constructor(
    private formBuilder: FormBuilder,
    public tipoDocumentoService: TipoDocumentoService,
    public terceroService: TerceroService,
    public ticketService: TicketService,
    public ubicacionService: UbicacionService,
    public personaService: PersonaService,
    public graduadoService: GraduadoService,
    public dialog: MatDialog,
    public firebaseFileServie: FirebaseFileService,
    private authService: AuthService,
    private router: Router,
    private datePipe: DatePipe
  ) {
    this.fechaLimiteMinima = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.fechaLimiteMinimaVigencia = this.datePipe.transform(
      new Date(),
      'yyyy-MM-dd'
    );
  }

  ngOnInit() {
    this.crearFormularioTercero();
    this.crearFormularioTiquetesEvento();
    this.obtenerSede();
  }

  private crearFormularioTiquetesEvento(): void {
    this.formularioTiquetesEvento = this.formBuilder.group({
      //Vaiables Entidad Tercero
      codigo: new FormControl(''),
      tipoDocumento: new FormControl(''),
      identificacion: new FormControl('', [
        Validators.required,
        Validators.maxLength(15),
      ]),
      email: new FormControl(''),
      nombre: new FormControl(''),
      apellido: new FormControl(''),
      sede: new FormControl(''),
      subsede: new FormControl(''),
      bloque: new FormControl(''),
      oficina: new FormControl(''),
      sedeCodigo: new FormControl(''),
      subsedeCodigo: new FormControl(''),
      bloqueCodigo: new FormControl(''),
      oficinaCodigo: new FormControl(''),
      tipoUbicacion: new FormControl('', Validators.required),
      fechaInicio: new FormControl('', Validators.required),
      fechaVigencia: new FormControl('', Validators.required),
    });
  }

  onFileChange(files: any) {
    this.logo = true;

    this.nameFile = files.target.files[0].name.replace(/\s/g, '');
    this.file = (event?.target as HTMLInputElement)?.files?.[0];

    let fileReader = new FileReader();

    fileReader.onload = (e) => {
      let arrayBuffer = fileReader.result;
      let workbook = XLSX.read(arrayBuffer, { type: 'buffer' });
      let worksheet = workbook.Sheets[workbook.SheetNames[0]];
      let data = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      this.personas = data;
      this.agruparRegistros();
    };

    fileReader.readAsArrayBuffer(this.file);
  }

  cargarLugar(lugar: any, codigo: any, condicion: any) {
    if (condicion === 1) {
      this.formularioTiquetesEvento.get('bloque')!.setValue(codigo);
    } else {
      this.formularioTiquetesEvento.get('oficinaCodigo')!.setValue(codigo);
    }
  }

  limiteVigencia() {
    this.fechaLimiteMinimaVigencia = this.datePipe.transform(
      this.formularioTiquetesEvento.get('fechaInicio')!.value,
      'yyyy-MM-dd'
    );
  }

  informacion() {
    swal.fire({
      icon: 'warning',
      title: 'Persona responsable del evento',
      text: 'La persona que se relaciona en el siguiente formulario recibirá una copia de todos los tiquetes como sistema de respaldo para el evento.',
    });
  }

  obtenerTipoDocumento() {
    this.tipoDocumentoService.getTiposDocumentos().subscribe((data) => {
      this.tipoDocumentos = data;
    });
  }

  agruparRegistros() {
    for (let index = 0; index < this.personas.length; index++) {
      this.personaService
        .obtenerPersonaPorIdentificacion(this.personas[index].Identificacion)
        .subscribe((data) => {
          if (JSON.stringify(data) !== '[]') {
            this.persona.push(data[0]);
            this.per = this.per + 1;
          } else {
            this.terceroService
              .getTerceroId(this.personas[index].Identificacion)
              .subscribe((data) => {
                if (JSON.stringify(data) !== '[]') {
                  this.tercero.push(data[0]);
                  this.ter = this.ter + 1;
                  if (
                    this.ter + this.per + this.insert ==
                    this.personas.length
                  ) {
                    this.logo = false;
                  }
                } else {
                  this.nuevos.push(this.personas[index]);
                  this.insert = this.insert + 1;
                  if (
                    this.ter + this.per + this.insert ==
                    this.personas.length
                  ) {
                    this.logo = false;
                  }
                }
              });
          }
        });
    }
  }

  verValores() {
    swal.fire({
      icon: 'success',
      title: 'Correos enviados',
      text: '¡Operación exitosa!',
      toast: true,
      position: 'top-right',
      timer: 2500,
    });
  }

  obtenerSede() {
    this.ubicacionService.obtenerSedes().subscribe((data) => {
      this.sedes = data;
    });
  }

  buscarSubsede(codigo: any) {
    this.formularioTiquetesEvento.get('subsede')!.reset;
    this.ubicacionService.buscarSubSedes(codigo).subscribe((data) => {
      this.subsedes = data;
    });
    this.formularioTiquetesEvento.get('oficina')!.reset;
    this.ubicacionService.buscarOficinas(codigo).subscribe((data) => {
      this.oficinas = data;
    });

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );
  }

  //FILTRO AUTOCOMPLETAR OFICINA
  private _filter(value: any): Oficina[] {
    const filterValue = value.toLowerCase();
    return this.oficinas.filter((oficina) =>
      oficina.uaaNombre.toLowerCase().includes(filterValue)
    );
  }

  buscarOficina(codigo: any) {
    this.formularioTiquetesEvento.get('oficina')!.reset;
    this.ubicacionService.buscarOficinas(codigo).subscribe((data) => {
      this.oficinas = data;
    });
  }

  buscarBloque(codigo: any) {
    this.formularioTiquetesEvento.get('bloque')!.reset;
    this.ubicacionService.buscarBloques(codigo).subscribe((data) => {
      this.bloques = data;
    });
  }

  buscarPersonaEvento() {
    this.ipuntEmailPersona = false;
    this.emails = [];
    this.personaService
      .obtenerPersonaPorIdentificacion(
        this.formularioTiquetesEvento.get('identificacion')!.value
      )
      .subscribe((data) => {
        if (JSON.stringify(data) !== '[]') {
          this.persona = data;
          this.personaExiste = true; //Cambia input email por un select email
          this.emails.push(
            this.persona[0].emailPersonal,
            this.persona[0].emailInterno
          );
          this.formularioTiquetesEvento.controls['email'].enable();
          this.formularioTiquetesEvento.controls['sede'].enable();
          this.formularioTiquetesEvento.controls['subsede'].enable();
          this.obtenerSede();
          this.obtenerTipoDocumento();
          this.formularioTiquetesEvento
            .get('codigo')!
            .setValue(this.persona[0].codigo);
          this.formularioTiquetesEvento
            .get('tipoDocumento')!
            .setValue(this.persona[0].tipoDocumento);
          this.formularioTiquetesEvento
            .get('nombre')!
            .setValue(this.persona[0].nombre);
          this.formularioTiquetesEvento
            .get('apellido')!
            .setValue(this.persona[0].apellido);
          this.formularioTiquetesEvento
            .get('email')!
            .setValue(this.persona[0].emailInterno);
        } else {
          swal.fire({
            icon: 'warning',
            title: 'Sin Resultados',
            text: 'No se encontró ninguna persona relacionada con el documento, por favor completar los campos necesarios para el registro.',
          });
        }
      });
  }

  //APLICA MISMO REGISTRO DEL COMPONENTE INVITADOS

  private crearFormularioTercero(): void {
    this.formTercero = this.formBuilder.group({
      //Vaiables Entidad Tercero
      codigo: new FormControl(''),
      tipoDocumento: new FormControl(
        { value: '', disabled: true },
        Validators.required
      ),
      identificacion: new FormControl('', [
        Validators.required,
        Validators.maxLength(15),
      ]),
      nombreCompleto: new FormControl(''),
      nombre1: new FormControl(''),
      nombre2: new FormControl(''),
      apellido1: new FormControl(''),
      apellido2: new FormControl(''),
      email: new FormControl(
        { value: '', disabled: true },
        Validators.required
      ),
      //Variables Entidad TicketVisitante
      terceroCodigo: new FormControl(''),
      nombre: new FormControl(
        { value: '', disabled: true },
        Validators.required
      ),
      apellido: new FormControl(
        { value: '', disabled: true },
        Validators.required
      ),
      sede: new FormControl({ value: '', disabled: true }, Validators.required),
      subsede: new FormControl(
        { value: '', disabled: true },
        Validators.required
      ),
      bloque: new FormControl(''),
      oficina: new FormControl(''),
      sedeCodigo: new FormControl(''),
      subsedeCodigo: new FormControl(''),
      bloqueCodigo: new FormControl(''),
      oficinaCodigo: new FormControl(''),
      tipoUbicacion: new FormControl('', Validators.required),
      fechaInicio: new FormControl('', Validators.required),
      fechaVigencia: new FormControl('', Validators.required),
    });
  }
}
