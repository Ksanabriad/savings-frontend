import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstudianteDetails } from './estudiante-details';

describe('EstudianteDetails', () => {
  let component: EstudianteDetails;
  let fixture: ComponentFixture<EstudianteDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EstudianteDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(EstudianteDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
