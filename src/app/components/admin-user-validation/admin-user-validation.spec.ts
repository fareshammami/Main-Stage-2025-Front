import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUserValidation } from './admin-user-validation';

describe('AdminUserValidation', () => {
  let component: AdminUserValidation;
  let fixture: ComponentFixture<AdminUserValidation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminUserValidation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminUserValidation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
