import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperacionCompletada } from './operacion-completada';

describe('OperacionCompletada', () => {
  let component: OperacionCompletada;
  let fixture: ComponentFixture<OperacionCompletada>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OperacionCompletada]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OperacionCompletada);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
