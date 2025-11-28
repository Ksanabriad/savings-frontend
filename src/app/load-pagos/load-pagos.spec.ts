import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadPagos } from './load-pagos';

describe('LoadPagos', () => {
  let component: LoadPagos;
  let fixture: ComponentFixture<LoadPagos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoadPagos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadPagos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
