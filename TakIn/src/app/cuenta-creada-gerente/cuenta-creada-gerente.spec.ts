import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuentaCreadaGerente } from './cuenta-creada-gerente';

describe('CuentaCreadaGerente', () => {
  let component: CuentaCreadaGerente;
  let fixture: ComponentFixture<CuentaCreadaGerente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CuentaCreadaGerente]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CuentaCreadaGerente);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
