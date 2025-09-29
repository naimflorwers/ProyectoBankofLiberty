import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CerrarCuenta } from './cerrar-cuenta';

describe('CerrarCuenta', () => {
  let component: CerrarCuenta;
  let fixture: ComponentFixture<CerrarCuenta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CerrarCuenta]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CerrarCuenta);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
