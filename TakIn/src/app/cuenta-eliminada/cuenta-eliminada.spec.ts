import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuentaEliminada } from './cuenta-eliminada';

describe('CuentaEliminada', () => {
  let component: CuentaEliminada;
  let fixture: ComponentFixture<CuentaEliminada>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CuentaEliminada]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CuentaEliminada);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
