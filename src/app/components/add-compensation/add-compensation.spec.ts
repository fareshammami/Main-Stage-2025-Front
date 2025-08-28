import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCompensation } from './add-compensation';

describe('AddCompensation', () => {
  let component: AddCompensation;
  let fixture: ComponentFixture<AddCompensation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddCompensation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCompensation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
