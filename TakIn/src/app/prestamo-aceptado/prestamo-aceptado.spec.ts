import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrestamoAceptado } from './prestamo-aceptado';

describe('PrestamoAceptado', () => {
  let component: PrestamoAceptado;
  let fixture: ComponentFixture<PrestamoAceptado>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrestamoAceptado]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrestamoAceptado);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
