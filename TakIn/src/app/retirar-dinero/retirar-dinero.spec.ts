import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetirarDinero } from './retirar-dinero';

describe('RetirarDinero', () => {
  let component: RetirarDinero;
  let fixture: ComponentFixture<RetirarDinero>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RetirarDinero]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RetirarDinero);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
