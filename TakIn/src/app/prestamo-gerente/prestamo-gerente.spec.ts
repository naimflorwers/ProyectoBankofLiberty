import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrestamoGerente } from './prestamo-gerente';

describe('PrestamoGerente', () => {
  let component: PrestamoGerente;
  let fixture: ComponentFixture<PrestamoGerente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrestamoGerente]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrestamoGerente);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
