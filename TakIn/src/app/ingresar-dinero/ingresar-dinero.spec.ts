import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngresarDinero } from './ingresar-dinero';

describe('IngresarDinero', () => {
  let component: IngresarDinero;
  let fixture: ComponentFixture<IngresarDinero>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IngresarDinero]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IngresarDinero);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
