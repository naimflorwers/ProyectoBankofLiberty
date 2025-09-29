import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditoGerente } from './credito-gerente';

describe('CreditoGerente', () => {
  let component: CreditoGerente;
  let fixture: ComponentFixture<CreditoGerente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreditoGerente]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditoGerente);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
