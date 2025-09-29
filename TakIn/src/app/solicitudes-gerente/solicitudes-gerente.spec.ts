import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudesGerente } from './solicitudes-gerente';

describe('SolicitudesGerente', () => {
  let component: SolicitudesGerente;
  let fixture: ComponentFixture<SolicitudesGerente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitudesGerente]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitudesGerente);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
