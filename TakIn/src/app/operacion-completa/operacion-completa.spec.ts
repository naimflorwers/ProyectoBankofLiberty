import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperacionCompleta } from './operacion-completa';

describe('OperacionCompleta', () => {
  let component: OperacionCompleta;
  let fixture: ComponentFixture<OperacionCompleta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OperacionCompleta]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OperacionCompleta);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
