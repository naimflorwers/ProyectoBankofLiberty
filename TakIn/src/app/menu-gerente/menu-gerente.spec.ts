import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuGerente } from './menu-gerente';

describe('MenuGerente', () => {
  let component: MenuGerente;
  let fixture: ComponentFixture<MenuGerente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuGerente]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuGerente);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
