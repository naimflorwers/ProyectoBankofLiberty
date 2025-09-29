import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmacionIdentidad } from './confirmacion-identidad';

describe('ConfirmacionIdentidad', () => {
  let component: ConfirmacionIdentidad;
  let fixture: ComponentFixture<ConfirmacionIdentidad>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmacionIdentidad]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmacionIdentidad);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
