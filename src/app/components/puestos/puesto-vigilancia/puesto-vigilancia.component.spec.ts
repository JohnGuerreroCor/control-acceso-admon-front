import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PuestoVigilanciaComponent } from './puesto-vigilancia.component';

describe('PuestoVigilanciaComponent', () => {
  let component: PuestoVigilanciaComponent;
  let fixture: ComponentFixture<PuestoVigilanciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PuestoVigilanciaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PuestoVigilanciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
