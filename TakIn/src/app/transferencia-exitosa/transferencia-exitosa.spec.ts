import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferenciaExitosa } from './transferencia-exitosa';

describe('TransferenciaExitosa', () => {
  let component: TransferenciaExitosa;
  let fixture: ComponentFixture<TransferenciaExitosa>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransferenciaExitosa]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransferenciaExitosa);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
