import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VigilanteComponent } from './vigilante.component';

describe('VigilanteComponent', () => {
  let component: VigilanteComponent;
  let fixture: ComponentFixture<VigilanteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VigilanteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VigilanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
