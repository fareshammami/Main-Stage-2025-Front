import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserHandledStream } from './user-handled-stream';

describe('UserHandledStream', () => {
  let component: UserHandledStream;
  let fixture: ComponentFixture<UserHandledStream>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserHandledStream]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserHandledStream);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
