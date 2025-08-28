import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInduError } from './add-indu-error';

describe('AddInduError', () => {
  let component: AddInduError;
  let fixture: ComponentFixture<AddInduError>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddInduError]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddInduError);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
