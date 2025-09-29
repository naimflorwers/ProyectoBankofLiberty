import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuentaEliminadaGerente } from './cuenta-eliminada-gerente';

describe('CuentaEliminadaGerente', () => {
  let component: CuentaEliminadaGerente;
  let fixture: ComponentFixture<CuentaEliminadaGerente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CuentaEliminadaGerente]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CuentaEliminadaGerente);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
