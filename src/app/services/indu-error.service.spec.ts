import { TestBed } from '@angular/core/testing';

import { InduError } from './indu-error.service';

describe('InduError', () => {
  let service: InduError;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InduError);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
