import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginG } from './login-g';

describe('LoginG', () => {
  let component: LoginG;
  let fixture: ComponentFixture<LoginG>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginG]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginG);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
