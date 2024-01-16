import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiqueteEventosComponent } from './tiquete-eventos.component';

describe('TiqueteEventosComponent', () => {
  let component: TiqueteEventosComponent;
  let fixture: ComponentFixture<TiqueteEventosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TiqueteEventosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TiqueteEventosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
