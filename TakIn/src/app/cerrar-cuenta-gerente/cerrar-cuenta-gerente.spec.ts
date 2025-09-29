import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CerrarCuentaGerente } from './cerrar-cuenta-gerente';

describe('CerrarCuentaGerente', () => {
  let component: CerrarCuentaGerente;
  let fixture: ComponentFixture<CerrarCuentaGerente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CerrarCuentaGerente]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CerrarCuentaGerente);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
