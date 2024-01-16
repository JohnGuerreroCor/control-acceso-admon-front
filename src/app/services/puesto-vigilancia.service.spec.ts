import { TestBed } from '@angular/core/testing';

import { PuestoVigilanciaService } from './puesto-vigilancia.service';

describe('PuestoVigilanciaService', () => {
  let service: PuestoVigilanciaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PuestoVigilanciaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
