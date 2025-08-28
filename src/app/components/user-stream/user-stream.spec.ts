import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserStream } from './user-stream';

describe('UserStream', () => {
  let component: UserStream;
  let fixture: ComponentFixture<UserStream>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserStream]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserStream);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
