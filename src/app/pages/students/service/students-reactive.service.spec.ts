import { TestBed } from '@angular/core/testing';

import { StudentsReactiveService } from './students-reactive.service';

describe('StudentsReactiveService', () => {
  let service: StudentsReactiveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentsReactiveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
