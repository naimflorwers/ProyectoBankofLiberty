import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrestamoAceptadoGerente } from './prestamo-aceptado-gerente';

describe('PrestamoAceptadoGerente', () => {
  let component: PrestamoAceptadoGerente;
  let fixture: ComponentFixture<PrestamoAceptadoGerente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrestamoAceptadoGerente]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrestamoAceptadoGerente);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
