import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadEstudiantes } from './load-estudiantes';

describe('LoadEstudiantes', () => {
  let component: LoadEstudiantes;
  let fixture: ComponentFixture<LoadEstudiantes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoadEstudiantes],
    }).compileComponents();

    fixture = TestBed.createComponent(LoadEstudiantes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
