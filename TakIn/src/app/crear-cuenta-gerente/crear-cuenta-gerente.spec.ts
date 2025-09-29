import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearCuentaGerente } from './crear-cuenta-gerente';

describe('CrearCuentaGerente', () => {
  let component: CrearCuentaGerente;
  let fixture: ComponentFixture<CrearCuentaGerente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearCuentaGerente]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearCuentaGerente);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
