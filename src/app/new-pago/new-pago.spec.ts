import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPago } from './new-pago';

describe('NewPago', () => {
  let component: NewPago;
  let fixture: ComponentFixture<NewPago>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewPago],
    }).compileComponents();

    fixture = TestBed.createComponent(NewPago);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
