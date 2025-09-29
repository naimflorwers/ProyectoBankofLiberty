import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuentaCreada } from './cuenta-creada';

describe('CuentaCreada', () => {
  let component: CuentaCreada;
  let fixture: ComponentFixture<CuentaCreada>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CuentaCreada]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CuentaCreada);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
