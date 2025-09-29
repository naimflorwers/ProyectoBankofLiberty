import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuEjecutivo } from './menu-ejecutivo';

describe('MenuEjecutivo', () => {
  let component: MenuEjecutivo;
  let fixture: ComponentFixture<MenuEjecutivo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuEjecutivo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuEjecutivo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
