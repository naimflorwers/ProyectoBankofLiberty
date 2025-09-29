import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferenciaDestino } from './transferencia-destino';

describe('TransferenciaDestino', () => {
  let component: TransferenciaDestino;
  let fixture: ComponentFixture<TransferenciaDestino>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransferenciaDestino]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransferenciaDestino);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
