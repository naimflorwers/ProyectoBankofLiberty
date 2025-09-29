import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginE } from './login-e';

describe('LoginE', () => {
  let component: LoginE;
  let fixture: ComponentFixture<LoginE>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginE]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginE);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
