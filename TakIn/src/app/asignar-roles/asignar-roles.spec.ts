import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarRoles } from './asignar-roles';

describe('AsignarRoles', () => {
  let component: AsignarRoles;
  let fixture: ComponentFixture<AsignarRoles>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsignarRoles]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsignarRoles);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
